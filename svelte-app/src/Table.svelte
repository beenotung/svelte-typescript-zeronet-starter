<script lang="ts">
    export let data = {}
</script>
<table>
    <tbody>
    {#each Object.entries(data) as [key, value]}
        <tr>
            <td>{key}</td>
            <td>
            {#if value && typeof value == "object"}
                <svelte:self data={value}/>
            {:else}
                {value}
            {/if}
            </td>
        </tr>
    {/each}
    </tbody>
</table>