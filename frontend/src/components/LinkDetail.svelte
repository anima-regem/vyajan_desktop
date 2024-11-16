<script>
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import Card from './Card.svelte';
  import Icon from './Icon.svelte';

  export let link;
  export let canDelete = false;

  const dispatch = createEventDispatcher();
</script>

<Card>
  <div class="sm:flex">
    {#if link.metadataImage}
      <div class="sm:w-1/3 sm:h-auto h-64 bg-dark-900 flex-shrink-0">
        <img
          src={link.metadataImage}
          alt=""
          class="w-full h-full object-cover"
        />
      </div>
    {/if}
    
    <div class="p-6 flex-grow">
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <h1 class="text-2xl font-bold text-accent-300">{link.title}</h1>
        <div class="flex gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            icon="visit"
            iconSize={14}
            class="flex-1 sm:flex-initial"
            on:click={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
          >
            Visit Link
          </Button>
          {#if canDelete}
            <Button 
              variant="secondary" 
              icon="delete"
              iconSize={14}
              class="text-red-400 hover:text-red-300 flex-1 sm:flex-initial" 
              on:click={() => dispatch('delete', link)}
            >
              Delete
            </Button>
          {/if}
        </div>
      </div>

      {#if link.metadataDescription}
        <p class="text-dark-300 mb-4">
          {link.metadataDescription}
        </p>
      {/if}

      <div class="border-t border-dark-700 pt-4 mt-4">
        <h2 class="text-lg font-semibold mb-4 text-accent-300">Link Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt class="text-sm font-medium text-dark-400 flex items-center gap-2 mb-1">
              <Icon name="visit" size={14} />
              URL
            </dt>
            <dd class="text-dark-200 break-all">
              {link.url}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-dark-400 flex items-center gap-2 mb-1">
              <Icon name="bookmark" size={14} />
              Added On
            </dt>
            <dd class="text-dark-200">
              {new Date(link.createdAt?.seconds * 1000).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-dark-400 flex items-center gap-2 mb-1">
              <Icon name={link.isArchived ? 'archive' : link.isPermanent ? 'pin' : 'bookmark'} size={14} />
              Status
            </dt>
            <dd class="text-dark-200 flex items-center gap-3">
              <span class="flex items-center gap-1.5">
                <Icon name={link.isArchived ? 'archive' : 'bookmark'} size={14} />
                {link.isArchived ? 'Archived' : 'Active'}
              </span>
              {#if link.isPermanent}
                <span class="text-accent-400 flex items-center gap-1.5">
                  <Icon name="pin" size={14} />
                  Pinned
                </span>
              {/if}
            </dd>
          </div>
        </div>
      </div>
    </div>
  </div>
</Card>
