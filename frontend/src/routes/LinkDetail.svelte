<script>
  import { onMount } from 'svelte';
  import { user } from '../lib/stores/auth';
  import { deleteLink, getLinkById } from '../lib/services/links';
  import LinkDetail from '../components/LinkDetail.svelte';
  import Button from '../components/Button.svelte';

  export let id;
  let link = null;
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      link = await getLinkById(id);
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });

  async function handleDelete() {
    try {
      await deleteLink(link.id);
      window.history.back();
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  }
</script>

<div class="min-h-screen bg-dark-950 py-8">
  <div class="container mx-auto px-4">
    <Button 
      class="mb-4 text-accent-400 hover:text-accent-300 flex items-center gap-2"
      on:click={() => window.history.back()}
    >
      ← Back to Links
    </Button>

    {#if loading}
      <div class="text-center py-8 text-dark-300">Loading...</div>
    {:else if error}
      <div class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
        {error}
      </div>
    {:else if link}
      <LinkDetail 
        {link} 
        canDelete={$user && link.userId === $user.uid}
        on:delete={handleDelete}
      />
    {/if}
  </div>
</div>
