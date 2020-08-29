<script lang="ts">
    import Table from './Table.svelte'
    import {page} from './store'
    let {siteInfo} = page
</script>
<details>
    <summary>
        <b>Site Info</b>
    </summary>
    <p>
        Zite Address: <a href={'/'+$siteInfo.address}>{$siteInfo.address}</a>
    </p>
    <p>
        Peers: {$siteInfo.peers}
    </p>
    <p>
        Size: {$siteInfo.settings?.size}
    </p>
    <p>
        Modified: {new Date($siteInfo.content?.modified * 1000).toString()}
    </p>
</details>
{#if !'dev'}
<hr>
<Table data={$siteInfo}/>
{/if}
<style>
details {
    background-color: lightgrey;
    padding: 0.5em;
}
details p {
    margin-bottom: 0;
}
</style>