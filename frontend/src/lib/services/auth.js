import { user } from '../stores/auth';
import { writable } from 'svelte/store';

export const loading = writable(false);

export const signInWithGoogle = async () => {
    try {
        loading.set(true);
        console.log('Signing in with Google...');
        const userInfo = await window.go.main.App.SignIn();
        console.log('Signed in with Google:', userInfo);
        
        // Convert the Go struct to a format similar to Firebase user
        const formattedUser = {
            uid: userInfo.ID,
            email: userInfo.Email,
            displayName: userInfo.Name,
            photoURL: userInfo.Picture,
            emailVerified: userInfo.VerifiedEmail,
        };
        
        user.set(formattedUser);
        return formattedUser;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    } finally {
        loading.set(false);
    }
};

export const signOutUser = async () => {
    try {
        loading.set(true);
        await window.go.main.App.SignOut();
        user.set(null);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    } finally {
        loading.set(false);
    }
};
