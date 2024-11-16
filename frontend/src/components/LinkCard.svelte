<script>
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import Card from './Card.svelte';
  import Icon from './Icon.svelte';

  export let link;
  const dispatch = createEventDispatcher();
</script>

<Card>
  <div class="sm:flex">
    {#if link.metadataImage}
      <div class="sm:w-48 sm:h-auto h-48 bg-dark-900 flex-shrink-0">
        <img
          src={link.metadataImage}
          alt=""
          class="w-full h-full object-cover"
        />
      </div>
    {/if}
    
    <div class="p-4 flex flex-col flex-grow">
      <div class="flex-grow">
        <h2 class="text-xl font-semibold text-accent-300 mb-2 line-clamp-2">
          {link.title}
        </h2>
        
        {#if link.metadataDescription}
          <p class="text-dark-300 mb-4 line-clamp-2 sm:line-clamp-3">
            {link.metadataDescription}
          </p>
        {/if}
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex gap-3 text-dark-400">
          {#if link.isArchived}
            <div class="flex items-center gap-1.5">
              <Icon name="archive" size={14} />
              <span class="text-sm">Archived</span>
            </div>
          {/if}
          {#if link.isPermanent}
            <div class="flex items-center gap-1.5 text-accent-400">
              <Icon name="pin" size={14} />
              <span class="text-sm">Pinned</span>
            </div>
          {/if}
        </div>
        
        <div class="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="primary" 
            icon="bookmark"
            iconSize={14}
            class="flex-1 sm:flex-initial" 
            on:click={() => dispatch('view', link)}
          >
            View
          </Button>
          <Button
            variant="secondary"
            icon="visit"
            iconSize={14}
            class="flex-1 sm:flex-initial"
            on:click={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
          >
            Visit
          </Button>
        </div>
      </div>
    </div>
  </div>
</Card>
