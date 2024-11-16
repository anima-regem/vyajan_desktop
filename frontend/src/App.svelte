<script>
  import { onMount } from 'svelte';
  import { user } from './lib/stores/auth';
  import { links } from './lib/stores/links';
  import { signInWithGoogle, signOutUser, loading as authLoading } from './lib/services/auth';
  import { addLink, getUserLinks, updateLinkStatus, deleteLink } from './lib/services/links';
  import LinkDetail from './routes/LinkDetail.svelte';
  import Logo from './components/Logo.svelte';
  import Button from './components/Button.svelte';
  import Icon from './components/Icon.svelte';
  import './app.css';

  let newUrl = '';
  let loading = false;
  let error = '';
  let selectedLinkId = null;

  $: sortedLinks = [...$links].sort((a, b) => {
    // Handle Firestore timestamps
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  onMount(() => {
    if ($user) {
      loadLinks();
    }
  });

  $: if ($user) {
    loadLinks();
  }

  async function loadLinks() {
    if ($user) {
      console.log('Loading links for user', $user.uid);
      try {
        loading = true;
        error = '';
        const fetchedLinks = await getUserLinks($user.uid);
        links.set(fetchedLinks);
      } catch (err) {
        error = 'Error loading links';
        console.error(err);
      } finally {
        loading = false;
      }
    }
  }

  async function handleAddLink() {
    if (!newUrl) return;
    
    try {
      loading = true;
      error = '';
      
      // Basic metadata for now - in a real app, you'd want to fetch metadata from the URL
      const metadata = {
        title: newUrl,
        description: '',
        image: ''
      };
      
      await addLink($user.uid, newUrl, metadata);
      newUrl = '';
      await loadLinks();
    } catch (err) {
      error = 'Error adding link';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function handleDelete(link) {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      await deleteLink(link.id);
      await loadLinks();
    } catch (err) {
      error = 'Error deleting link';
      console.error(err);
    }
  }

  async function toggleArchived(link) {
    try {
      await updateLinkStatus(link.id, { isArchived: !link.isArchived, isPermanent: link.isPermanent });
      await loadLinks();
    } catch (err) {
      error = 'Error updating link';
      console.error(err);
    }
  }

  async function togglePermanent(link) {
    try {
      await updateLinkStatus(link.id, { isPermanent: !link.isPermanent, isArchived: link.isArchived });
      await loadLinks();
    } catch (err) {
      error = 'Error updating link';
      console.error(err);
    }
  }

  function viewLinkDetails(linkId) {
    selectedLinkId = linkId;
  }

  function closeDetails() {
    selectedLinkId = null;
  }
</script>

<main class="min-h-screen bg-dark-950 text-dark-100">
  {#if selectedLinkId}
    <LinkDetail linkId={selectedLinkId} />
  {:else}
    <div class="container mx-auto px-4 py-8">
      {#if !$user}
        <div class="flex flex-col items-center justify-center min-h-[60vh]">
          <div class="mb-12">
            <Logo size={64} />
          </div>
          <p class="text-lg text-dark-300 mb-8 text-center max-w-md">
            Your personal bookmark sanctuary. Save, organize, and access your bookmarks with elegance.
          </p>
          <Button 
            variant="primary" 
            icon="bookmark" 
            on:click={signInWithGoogle}
            disabled={$authLoading}
          >
            {#if $authLoading}
              <div class="flex items-center gap-2">
                <Icon name="spinner" class="animate-spin" />
                Signing in...
              </div>
            {:else}
              Sign in with Google
            {/if}
          </Button>
        </div>
      {:else}
        <div class="flex justify-between items-center mb-8">
          <Logo size={40} />
          <div class="flex items-center gap-4">
            <span class="text-dark-300">{$user.email}</span>
            <Button 
              variant="secondary" 
              icon="back" 
              on:click={signOutUser}
              disabled={$authLoading}
            >
              {#if $authLoading}
                <Icon name="spinner" class="animate-spin" />
              {:else}
                Sign Out
              {/if}
            </Button>
          </div>
        </div>

        {#if error}
          <div class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        {/if}

        <div class="bg-dark-800 rounded-lg shadow-lg shadow-dark-950/50 p-6 mb-8">
          <form on:submit|preventDefault={handleAddLink} class="flex gap-4">
            <input
              type="url"
              bind:value={newUrl}
              placeholder="Enter URL to bookmark"
              class="input flex-grow"
              required
            />
            <Button type="submit" variant="primary" icon="add" disabled={loading}>
              Add Bookmark
            </Button>
          </form>
        </div>

        {#if loading}
          <div class="text-center py-8 text-dark-300">Loading...</div>
        {:else}
          <div class="grid gap-4">
            {#each sortedLinks as link (link.id)}
              <div class="bg-dark-800 rounded-lg shadow-lg shadow-dark-950/50 p-4 flex items-start gap-4">
                {#if link.metadataImage}
                  <button
                    class="w-24 h-24 p-0 border-0 bg-transparent"
                    on:click={() => viewLinkDetails(link.id)}
                    on:keydown={(e) => e.key === 'Enter' && viewLinkDetails(link.id)}
                  >
                    <img
                      src={link.metadataImage}
                      alt={link.title}
                      class="w-full h-full object-cover rounded"
                    />
                  </button>
                {/if}
                <div class="flex-grow">
                  <div class="flex items-start justify-between gap-4">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-lg font-medium text-accent-400 hover:text-accent-300"
                    >
                      {link.title}
                    </a>
                    <div class="flex gap-2">
                      <Button variant="secondary" icon="info" on:click={() => viewLinkDetails(link.id)}>
                        View Details
                      </Button>
                      <Button variant="secondary" icon="archive" on:click={() => toggleArchived(link)}>
                        {link.isArchived ? 'Unarchive' : 'Archive'}
                      </Button>
                      <Button variant="secondary" icon="pin" on:click={() => togglePermanent(link)}>
                        {link.isPermanent ? 'Unpin' : 'Pin'}
                      </Button>
                      <Button variant="secondary" icon="trash" on:click={() => handleDelete(link)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  {#if link.metadataDescription}
                    <p class="text-dark-300 mt-2 line-clamp-2">
                      {link.metadataDescription}
                    </p>
                  {/if}
                  <div class="text-sm text-dark-400 mt-2">
                    {new Date(link.createdAt?.seconds * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    @apply bg-dark-950;
  }
</style>
