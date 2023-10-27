<template>

  <div class="overflow-hidden overflow-x-auto relative" ref="tableContainer">
    <table
        v-if="resources.length > 0" ref="resourceTable"
        class="w-full divide-y divide-gray-100 dark:divide-gray-700"
        data-testid="resource-table"
    >
      <ResourceTableHeader
          :resource-name="resourceName"
          :fields="fields"
          :should-show-column-borders="shouldShowColumnBorders"
          :should-show-checkboxes="shouldShowCheckboxes"
          :sortable="sortable"
          @order="requestOrderByChange"
          @reset-order-by="resetOrderBy"
          :visibleColumns="visibleColumns"
          :containerWidth="containerWidth"
          :responsive="responsive"
      />

      <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
      <ResourceTableRow
          v-for="(resource, index) in resources"
          @actionExecuted="$emit('actionExecuted')"
          :testId="`${resourceName}-items-${index}`"
          :key="`${resource.id.value}-items-${index}`"
          :delete-resource="deleteResource"
          :restore-resource="restoreResource"
          :resource="resource"
          :resource-name="resourceName"
          :relationship-type="relationshipType"
          :via-relationship="viaRelationship"
          :via-resource="viaResource"
          :via-resource-id="viaResourceId"
          :via-many-to-many="viaManyToMany"
          :checked="selectedResources.indexOf(resource) > -1"
          :actions-are-available="actionsAreAvailable"
          :actions-endpoint="actionsEndpoint"
          :should-show-checkboxes="shouldShowCheckboxes"
          :should-show-column-borders="shouldShowColumnBorders"
          :table-style="tableStyle"
          :responsive="responsive"
          :update-selection-status="updateSelectionStatus"
          :click-action="clickAction"
          :visibleColumns="visibleColumns"
          :containerWidth="containerWidth"
      />
      </tbody>
    </table>
  </div>
</template>

<script>
import {InteractsWithResourceInformation} from 'laravel-nova-mixins'

export default {
  emits: ['actionExecuted', 'delete', 'restore', 'order', 'reset-order-by'],

  mixins: [InteractsWithResourceInformation],

  props: {
    authorizedToRelate: {type: Boolean, required: true},
    resourceName: {default: null},
    resources: {default: []},
    singularName: {type: String, required: true},
    selectedResources: {default: []},
    selectedResourceIds: {},
    shouldShowCheckboxes: {type: Boolean, default: false},
    actionsAreAvailable: {type: Boolean, default: false},
    viaResource: {default: null},
    viaResourceId: {default: null},
    viaRelationship: {default: null},
    relationshipType: {default: null},
    updateSelectionStatus: {type: Function},
    actionsEndpoint: {default: null},
    sortable: {type: Boolean, default: false},
  },

  data: () => ({
    selectAllResources: false,
    selectAllMatching: false,
    resourceCount: null,
    visibleColumns: 10,
    containerWidth: null,
    columnsWidth: {}
  }),

  mounted() {
    this.getSizes();
    window.addEventListener("resize", this.containerWidthWatcher);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.containerWidthWatcher);
  },

  methods: {
    async getSizes() {
      await this.$nextTick();
      const container = this.$refs.tableContainer;
      const table = this.$refs.resourceTable;

      if (!container || !table) return;

      const containerWidth = container.offsetWidth;
      this.containerWidth = containerWidth;

      const headerColumns = table.querySelectorAll("thead th");

      let totalWidth = 0;
      let visibleColumns = 0;

      headerColumns.forEach((column, index) => {
        const columnWidth = column.offsetWidth;
        totalWidth += columnWidth;

        this.columnsWidth[index] = columnWidth;

        if (totalWidth <= containerWidth - headerColumns[headerColumns.length - 1].offsetWidth) {
          visibleColumns += 1;
        } else {
          return false;
        }
      });

      this.visibleColumns = visibleColumns - 1;

      console.log("Columns width: ", this.columnsWidth);
    },

    containerWidthWatcher() {
      let totalWidth = 100;
      let visibleColumns = 0;
      const container = this.$refs.tableContainer;
      if (!container || !this.columnsWidth) return;
      let baseWidth = this.columnsWidth[Object.keys(this.columnsWidth).length - 1];

      for (let i = 0; i < Object.keys(this.columnsWidth).length; i++) {
        const columnWidth = this.columnsWidth[i];
        if (totalWidth + columnWidth <= container.offsetWidth - baseWidth) {
          visibleColumns++;
          totalWidth += columnWidth;
        } else {
          break;
        }
      }
      this.visibleColumns = visibleColumns;
    },


    /**
     * Delete the given resource.
     */
    deleteResource(resource) {
      this.$emit('delete', [resource])
    },

    /**
     * Restore the given resource.
     */
    restoreResource(resource) {
      this.$emit('restore', [resource])
    },

    /**
     * Broadcast that the ordering should be updated.
     */
    requestOrderByChange(field) {
      this.$emit('order', field)
    },

    /**
     * Broadcast that the ordering should be reset.
     */
    resetOrderBy(field) {
      this.$emit('reset-order-by', field)
    },
  },

  computed: {
    responsive() {
      return this.resourceInformation.tableStyle && this.resourceInformation.tableStyle.includes('responsive');
    },
    /**
     * Get all of the available fields for the resources.
     */
    fields() {
      if (this.resources) {
        return this.resources[0].fields
      }
    },

    /**
     * Determine if the current resource listing is via a many-to-many relationship.
     */
    viaManyToMany() {
      return (
          this.relationshipType == 'belongsToMany' ||
          this.relationshipType == 'morphToMany'
      )
    },

    /**
     * Determine if the resource table should show column borders.
     */
    shouldShowColumnBorders() {
      return this.resourceInformation.showColumnBorders
    },

    tableStyle() {
      if (this.resourceInformation.tableStyle) {
        return this.resourceInformation.tableStyle.replace('responsive', '').trim();
      }
      return null;
    },

    clickAction() {
      return this.resourceInformation.clickAction
    },
  },
}
</script>
