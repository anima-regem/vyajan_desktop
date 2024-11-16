package main

import (
	"context"
	"fmt"
	"net/http"
	"runtime"
	"os/exec"
	"sync"

	"vyajan_desktop/oauth"
	"golang.org/x/oauth2"
)

// App struct
type App struct {
	ctx        context.Context
	oauthToken *oauth2.Token
	userInfo   *oauth.UserInfo
	server     *http.Server
	mutex      sync.Mutex
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// SignIn initiates the OAuth sign-in process
func (a *App) SignIn() (*oauth.UserInfo, error) {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	// Start local server to handle OAuth callback
	done := make(chan bool)
	var callbackErr error
	var token *oauth2.Token

	// Start server for OAuth callback
	server := &http.Server{Addr: ":14562"}
	a.server = server

	http.HandleFunc("/callback", func(w http.ResponseWriter, r *http.Request) {
		code := r.URL.Query().Get("code")
		token, callbackErr = oauth.HandleCallback(code)
		if callbackErr != nil {
			http.Error(w, "Failed to exchange token", http.StatusInternalServerError)
			done <- true
			return
		}

		// Get user info
		userInfo, err := oauth.GetUserInfo(token)
		if err != nil {
			http.Error(w, "Failed to get user info", http.StatusInternalServerError)
			done <- true
			return
		}

		a.oauthToken = token
		a.userInfo = userInfo

		// Send success response
		w.Write([]byte("<script>window.close();</script>"))
		done <- true
	})

	// Get auth URL and open in browser
	authURL := oauth.GetAuthURL()
	err := OpenURL(authURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open browser: %v", err)
	}

	// Wait for callback
	go func() {
		server.ListenAndServe()
	}()

	<-done // Wait for callback to complete

	// Shutdown server
	if err := server.Shutdown(context.Background()); err != nil {
		fmt.Printf("Error shutting down server: %v\n", err)
	}

	if callbackErr != nil {
		return nil, callbackErr
	}

	return a.userInfo, nil
}

// SignOut handles the sign-out process
func (a *App) SignOut() error {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	a.oauthToken = nil
	a.userInfo = nil
	return nil
}

// OpenURL opens the specified URL in the default browser
func OpenURL(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, url)
	return exec.Command(cmd, args...).Start()
}
