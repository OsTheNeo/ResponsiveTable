import ResourceTable from "./components/ResourceTable.vue";
import ResourceTableHeader from "./components/ResourceTableHeader.vue";
import ResourceTableRow from "./components/ResourceTableRow.vue";

Nova.booting((app, store) => {
    app.component('ResourceTable', ResourceTable);
    app.component('ResourceTableHeader', ResourceTableHeader);
    app.component('ResourceTableRow', ResourceTableRow);
})
