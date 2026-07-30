<template>
  <section class="floor-map-card" :class="{ 'edit-mode': isEditMode }">
    <header class="floor-map-header">
      <div>
        <div class="title-row">
          <h2>{{ t('tables.floorMap.title') }}</h2>
          <span v-if="isEditMode" class="editing-badge">
            <q-icon name="edit" size="14px" />
            {{ t('tables.floorMap.editingBadge') }}
          </span>
          <span v-if="isColliding" class="collision-badge">
            <q-icon name="warning" size="14px" />
            {{ t('tables.floorMap.collisionNotice') }}
          </span>
        </div>
        <small>{{ t('tables.floorMap.subtitle', { branch: branchName }) }}</small>
      </div>

      <section class="map-controls">
        <section class="map-legend">
          <span class="legend-item available">
            <span class="legend-dot available"></span>
            {{ t('tables.status.available') }}
          </span>
          <span class="legend-item occupied">
            <span class="legend-dot occupied"></span>
            {{ t('tables.status.occupied') }}
          </span>
          <span class="legend-item cleaning">
            <span class="legend-dot cleaning"></span>
            {{ t('tables.status.cleaning') }}
          </span>
          <span class="legend-item reserved">
            <span class="legend-dot reserved"></span>
            {{ t('tables.status.reserved') }}
          </span>
        </section>

        <!-- Dynamic Renovation Walkway Controls -->
        <div v-if="isEditMode" class="add-walkway-wrapper">
          <button
            type="button"
            class="map-action-btn"
            :class="{ 'dropdown-open': isWalkwayMenuOpen }"
            @click="isWalkwayMenuOpen = !isWalkwayMenuOpen"
          >
            <q-icon name="add_road" size="16px" />
            <span>{{ t('tables.floorMap.addWalkway') }}</span>
            <q-icon name="arrow_drop_down" size="16px" />
          </button>
          <div v-if="isWalkwayMenuOpen" class="walkway-dropdown-menu">
            <button
              type="button"
              class="walkway-menu-item"
              @click="
                addWalkway('horizontal');
                isWalkwayMenuOpen = false;
              "
            >
              <q-icon name="horizontal_rule" size="16px" />
              <span>{{ t('tables.floorMap.addWalkwayH') }}</span>
            </button>
            <button
              type="button"
              class="walkway-menu-item"
              @click="
                addWalkway('vertical');
                isWalkwayMenuOpen = false;
              "
            >
              <q-icon name="height" size="16px" />
              <span>{{ t('tables.floorMap.addWalkwayV') }}</span>
            </button>
          </div>
        </div>

        <button v-if="isEditMode" type="button" class="map-action-btn danger" @click="resetLayout">
          <q-icon name="restart_alt" size="16px" />
          <span>{{ t('tables.floorMap.resetMap') }}</span>
        </button>

        <button
          type="button"
          class="map-action-btn"
          :class="{ primary: isEditMode }"
          @click="toggleEditMode"
        >
          <q-icon :name="isEditMode ? 'check' : 'edit'" size="16px" />
          <span>{{
            isEditMode ? t('tables.floorMap.doneEdit') : t('tables.floorMap.editMap')
          }}</span>
        </button>
      </section>
    </header>

    <section
      ref="canvasRef"
      class="floor-map-canvas"
      :class="{ 'grid-active': isEditMode }"
      :style="canvasStyle"
    >
      <GuidedTooltip
        v-if="!isEditMode"
        class="floor-map-guide-tooltip"
        :title="t('tables.guides.floorMapTitle')"
        :message="t('tables.guides.floorMapMessage')"
        :close-label="t('tables.guides.close')"
        session-key="tables.floorMapGuide.dismissed"
        placement="top-left"
      />
      <div class="map-nodes-container">
        <!-- Render 3D Walkway Nodes -->
        <article
          v-for="walkway in walkways"
          :id="`map-node-${walkway.id}`"
          :key="walkway.id"
          class="map-node-block node-walkway"
          :class="[
            `node-walkway-${walkway.orientation}`,
            {
              dragging: activeDragId === walkway.id,
              editable: isEditMode,
              selected: selectedWalkwayId === walkway.id && isEditMode,
            },
          ]"
          :style="getWalkwayStyle(walkway)"
          @pointerdown="
            (e) =>
              renamingWalkwayId !== walkway.id && !isResizing && startDragWalkway(walkway.id, e)
          "
          @click="onWalkwayClick(walkway.id)"
        >
          <div class="walkway-texture-pattern"></div>
          <div
            class="walkway-label-badge"
            :title="isEditMode ? 'คลิกเพื่อเปลี่ยนชื่อ' : ''"
            @click.stop="isEditMode && startRenameWalkway(walkway.id, walkway.label)"
          >
            <template v-if="renamingWalkwayId === walkway.id">
              <input
                ref="renameInputRef"
                v-model="renameValue"
                class="walkway-rename-input"
                type="text"
                @keydown.enter.prevent="commitRename(walkway.id)"
                @keydown.esc.prevent="cancelRename"
                @blur="commitRename(walkway.id)"
                @pointerdown.stop
                @click.stop
              />
            </template>
            <template v-else>
              <q-icon name="directions_walk" size="12px" />
              <span>{{ walkway.label || t('tables.floorMap.walkwayLabel') }}</span>
              <q-icon v-if="isEditMode" name="edit" size="10px" class="rename-hint-icon" />
            </template>
          </div>

          <!-- Resize handles (edit mode only) -->
          <template v-if="isEditMode && selectedWalkwayId === walkway.id">
            <!-- Horizontal walkway: left / right handles -->
            <div
              v-if="walkway.orientation === 'horizontal'"
              class="resize-handle resize-handle-left"
              @pointerdown.stop.prevent="(e) => startResizeWalkway(walkway.id, 'left', e)"
            />
            <div
              v-if="walkway.orientation === 'horizontal'"
              class="resize-handle resize-handle-right"
              @pointerdown.stop.prevent="(e) => startResizeWalkway(walkway.id, 'right', e)"
            />
            <!-- Vertical walkway: top / bottom handles -->
            <div
              v-if="walkway.orientation === 'vertical'"
              class="resize-handle resize-handle-top"
              @pointerdown.stop.prevent="(e) => startResizeWalkway(walkway.id, 'top', e)"
            />
            <div
              v-if="walkway.orientation === 'vertical'"
              class="resize-handle resize-handle-bottom"
              @pointerdown.stop.prevent="(e) => startResizeWalkway(walkway.id, 'bottom', e)"
            />
          </template>

          <!-- Floating Actions for Selected Walkway in Edit Mode -->
          <div
            v-if="isEditMode && selectedWalkwayId === walkway.id"
            class="walkway-actions-overlay"
            @pointerdown.stop.prevent
          >
            <button
              type="button"
              class="walkway-action-btn rename"
              :title="'เปลี่ยนชื่อ'"
              @click.stop.prevent="startRenameWalkway(walkway.id, walkway.label)"
            >
              <q-icon name="edit" size="12px" />
            </button>
            <button
              type="button"
              class="walkway-action-btn rotate"
              :title="t('tables.floorMap.rotateWalkway')"
              @click.stop.prevent="rotateWalkway(walkway.id)"
            >
              <q-icon name="rotate_right" size="14px" />
            </button>
            <button
              type="button"
              class="walkway-action-btn delete"
              :title="t('tables.floorMap.deleteWalkway')"
              @click.stop.prevent="deleteWalkway(walkway.id)"
            >
              <q-icon name="delete" size="14px" />
            </button>
          </div>
        </article>

        <!-- Render Landmark and Table Nodes -->
        <article
          v-for="node in nodes"
          :id="`map-node-${node.id}`"
          :key="node.id"
          class="map-node-block"
          :class="[
            node.typeClass,
            node.statusClass,
            {
              dragging: activeDragId === node.id,
              editable: isEditMode,
              colliding: activeDragId === node.id && isColliding,
              snapback: isSnappingBack && activeDragId === node.id,
              'node-focused-pulse': isNodeFocused(node.id),
            },
          ]"
          :style="getNodeStyle(node)"
          @pointerdown="(e) => startDrag(node.id, e)"
          @click="onNodeClick(node)"
        >
          <q-icon v-if="node.icon" :name="node.icon" size="20px" />
          <span>{{ node.labelKey ? t(node.labelKey) : node.label }}</span>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, type CSSProperties } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableManagementItem } from '@/types/dining-table';
import GuidedTooltip from '@/components/base/guided-tooltip.vue';
import { floorMapLayoutConfig } from '@/constants/floor-map';

const { t } = useI18n();

const props = defineProps<{
  branchName: string;
  tables: TableManagementItem[];
  focusedTableId?: number | null;
}>();

const emit = defineEmits<{
  (e: 'expand-map'): void;
  (e: 'focus-card', tableId: number): void;
}>();

interface MapNodeItem {
  id: string;
  tableId?: number;
  label?: string;
  labelKey?: string;
  icon?: string;
  typeClass: string;
  statusClass: string;
  width: number;
  height: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
}

interface WalkwayItem {
  id: string;
  orientation: 'horizontal' | 'vertical';
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

interface TableMapPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

const isEditMode = ref(false);
const isColliding = ref(false);
const isSnappingBack = ref(false);
const canvasRef = ref<HTMLElement | null>(null);
const activeDragId = ref<string | null>(null);
const selectedWalkwayId = ref<string | null>(null);
const dragOffset = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const animFrameId = ref<number | null>(null);
const isWalkwayMenuOpen = ref(false);
const renamingWalkwayId = ref<string | null>(null);
const renameValue = ref('');
const renameInputRef = ref<HTMLInputElement | null>(null);
const isResizing = ref(false);

// Default 3D Walkways with zero overlap and clean 15px-16px spacing
const initialWalkways: WalkwayItem[] = [
  {
    id: 'walkway-main',
    orientation: 'horizontal',
    x: 20,
    y: 82,
    width: 1000,
    height: 24,
    label: 'ทางเดินหลัก',
  },
  {
    id: 'walkway-aisle-1',
    orientation: 'vertical',
    x: 395,
    y: 122,
    width: 20,
    height: 272,
    label: 'ทางเดิน 1',
  },
  {
    id: 'walkway-aisle-2',
    orientation: 'vertical',
    x: 745,
    y: 122,
    width: 20,
    height: 272,
    label: 'ทางเดิน 2',
  },
  {
    id: 'walkway-aisle-3',
    orientation: 'vertical',
    x: 895,
    y: 122,
    width: 20,
    height: 272,
    label: 'ทางเดิน 3',
  },
];

const walkways = ref<WalkwayItem[]>([...initialWalkways]);

// Shabu restaurant landmark amenity blocks
const landmarkNodes: MapNodeItem[] = [
  {
    id: 'queue',
    labelKey: 'tables.floorMap.queueArea',
    icon: 'event_seat',
    typeClass: 'node-landmark node-queue',
    statusClass: 'landmark',
    width: 120,
    height: 46,
    x: 20,
    y: 20,
    startX: 20,
    startY: 20,
  },
  {
    id: 'cashier',
    labelKey: 'tables.floorMap.cashierArea',
    icon: 'payments',
    typeClass: 'node-landmark node-cashier',
    statusClass: 'landmark',
    width: 130,
    height: 46,
    x: 155,
    y: 20,
    startX: 155,
    startY: 20,
  },
  {
    id: 'drinks',
    labelKey: 'tables.floorMap.drinkArea',
    icon: 'local_drink',
    typeClass: 'node-landmark node-drink',
    statusClass: 'landmark',
    width: 150,
    height: 46,
    x: 500,
    y: 20,
    startX: 500,
    startY: 20,
  },
  {
    id: 'bar',
    labelKey: 'tables.floorMap.mainBar',
    icon: 'local_bar',
    typeClass: 'node-landmark node-bar',
    statusClass: 'landmark',
    width: 130,
    height: 46,
    x: 665,
    y: 20,
    startX: 665,
    startY: 20,
  },
  {
    id: 'snack',
    labelKey: 'tables.floorMap.snackArea',
    icon: 'fastfood',
    typeClass: 'node-landmark node-snack',
    statusClass: 'landmark',
    width: 135,
    height: 46,
    x: 810,
    y: 20,
    startX: 810,
    startY: 20,
  },
];

// Preset coordinates layout for all 16 tables with clean spacing & zero overlap
const presetCoords: Record<number, TableMapPosition> = {
  1: { x: 290, y: 122 },
  2: { x: 290, y: 194 },
  3: { x: 290, y: 266 },
  4: { x: 290, y: 338 },
  5: { x: 430, y: 122 },
  6: { x: 540, y: 122, width: 190, height: 56 },
  7: { x: 430, y: 194 },
  8: { x: 430, y: 266 },
  9: { x: 430, y: 338 },
  10: { x: 780, y: 122 },
  11: { x: 780, y: 194 },
  12: { x: 780, y: 266 },
  13: { x: 780, y: 338 },
  14: { x: 930, y: 122 },
  15: { x: 930, y: 194 },
  16: { x: 930, y: 266 },
};

const customPositions = ref<Record<string, { x: number; y: number }>>({});

const presetTableIds = new Set(Object.keys(presetCoords).map(Number));

const getFallbackTablePosition = (index: number): TableMapPosition => {
  const sequence = Math.max(index - presetTableIds.size, 0);
  return {
    x:
      floorMapLayoutConfig.fallbackStartX +
      (sequence % floorMapLayoutConfig.fallbackColumns) * floorMapLayoutConfig.fallbackGapX,
    y:
      floorMapLayoutConfig.fallbackStartY +
      Math.floor(sequence / floorMapLayoutConfig.fallbackColumns) *
        floorMapLayoutConfig.fallbackGapY,
  };
};

const nodes = computed<MapNodeItem[]>(() => {
  const result: MapNodeItem[] = [];

  // Add Landmark Nodes
  landmarkNodes.forEach((landmark) => {
    const pos = customPositions.value[landmark.id] || { x: landmark.x, y: landmark.y };
    result.push({
      ...landmark,
      x: pos.x,
      y: pos.y,
    });
  });

  // Add Table Nodes (All 16 tables)
  props.tables.forEach((table, index) => {
    const id = `t${table.tableId}`;
    const preset = presetCoords[table.tableId] || getFallbackTablePosition(index);

    const savedPos = customPositions.value[id] || { x: preset.x, y: preset.y };

    result.push({
      id,
      tableId: table.tableId,
      label: table.tableNumber,
      typeClass: 'node-table',
      statusClass: table.status,
      width: preset.width || floorMapLayoutConfig.tableWidth,
      height: preset.height || floorMapLayoutConfig.tableHeight,
      x: savedPos.x,
      y: savedPos.y,
      startX: savedPos.x,
      startY: savedPos.y,
    });
  });

  return result;
});

const canvasStyle = computed<CSSProperties>(() => {
  const tableNodes = nodes.value.filter((node) => node.typeClass === 'node-table');
  const maxBottom = tableNodes.reduce<number>(
    (bottom, node) => Math.max(bottom, node.y + node.height),
    floorMapLayoutConfig.minCanvasHeight,
  );
  const height = Math.max(
    floorMapLayoutConfig.minCanvasHeight,
    maxBottom + floorMapLayoutConfig.canvasBottomPadding,
  );
  return {
    height: `${height}px`,
  };
});

interface SavedSessionLayout {
  customPositions: Record<string, { x: number; y: number }>;
  walkways: WalkwayItem[];
}

const savedSessionState = ref<SavedSessionLayout | null>(null);

const saveSessionState = (): void => {
  const snapshot: SavedSessionLayout = {
    customPositions: JSON.parse(JSON.stringify(customPositions.value)),
    walkways: JSON.parse(JSON.stringify(walkways.value)),
  };
  savedSessionState.value = snapshot;
  try {
    sessionStorage.setItem('floor_map_session_saved', JSON.stringify(snapshot));
  } catch {
    // Ignore storage exceptions
  }
};

const toggleEditMode = (): void => {
  if (isEditMode.value) {
    // Save session layout snapshot when exiting edit mode ("เสร็จสิ้น")
    saveSessionState();
    selectedWalkwayId.value = null;
    isWalkwayMenuOpen.value = false;
    cancelRename();
  }
  isEditMode.value = !isEditMode.value;
};

const startRenameWalkway = (id: string, currentLabel: string | undefined): void => {
  if (!isEditMode.value) return;
  renamingWalkwayId.value = id;
  renameValue.value = currentLabel ?? '';
  void nextTick(() => {
    const rawRef = renameInputRef.value;
    const targetEl = Array.isArray(rawRef) ? (rawRef[0] as HTMLInputElement | undefined) : rawRef;
    targetEl?.focus();
    targetEl?.select();
  });
};

const commitRename = (id: string): void => {
  const walkway = walkways.value.find((w) => w.id === id);
  if (walkway && renameValue.value.trim()) {
    walkway.label = renameValue.value.trim();
  }
  cancelRename();
};

const cancelRename = (): void => {
  renamingWalkwayId.value = null;
  renameValue.value = '';
};

const resetLayout = (): void => {
  let saved: SavedSessionLayout | null = savedSessionState.value;

  if (!saved) {
    try {
      const stored = sessionStorage.getItem('floor_map_session_saved');
      if (stored) {
        saved = JSON.parse(stored) as SavedSessionLayout;
        savedSessionState.value = saved;
      }
    } catch {
      // Ignore storage errors
    }
  }

  if (saved) {
    // Reset back to the latest saved layout of this session
    customPositions.value = JSON.parse(JSON.stringify(saved.customPositions));
    walkways.value = JSON.parse(JSON.stringify(saved.walkways));
  } else {
    // No save in this session yet -> Reset to default mock data
    customPositions.value = {};
    walkways.value = initialWalkways.map((w) => ({ ...w }));
  }

  isColliding.value = false;
  selectedWalkwayId.value = null;
  cancelRename();
};

// Add Walkway functionality for renovation
const addWalkway = (orientation: 'horizontal' | 'vertical'): void => {
  const newId = `walkway-${Date.now()}`;
  const width = orientation === 'horizontal' ? 300 : 20;
  const height = orientation === 'horizontal' ? 20 : 200;

  walkways.value.push({
    id: newId,
    orientation,
    x: 60,
    y: 120,
    width,
    height,
    label: t('tables.floorMap.walkwayLabel'),
  });

  selectedWalkwayId.value = newId;
};

const rotateWalkway = (id: string): void => {
  const walkway = walkways.value.find((w) => w.id === id);
  if (!walkway) return;

  const currentOrientation = walkway.orientation;
  const newOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
  const oldWidth = walkway.width;
  const oldHeight = walkway.height;

  walkway.orientation = newOrientation;
  walkway.width = oldHeight;
  walkway.height = oldWidth;
};

const deleteWalkway = (id: string): void => {
  walkways.value = walkways.value.filter((w) => w.id !== id);
  if (selectedWalkwayId.value === id) {
    selectedWalkwayId.value = null;
  }
};

const onWalkwayClick = (id: string): void => {
  if (isEditMode.value) {
    selectedWalkwayId.value = id;
  }
};

const isNodeFocused = (nodeId: string): boolean => {
  if (!props.focusedTableId) return false;
  const numericId = parseInt(nodeId.replace(/\D/g, ''), 10);
  return numericId === props.focusedTableId;
};

const scrollFocusedNodeIntoView = async (): Promise<void> => {
  if (!props.focusedTableId) return;

  await nextTick();

  const focusedNode = canvasRef.value?.querySelector<HTMLElement>(
    `#map-node-t${props.focusedTableId}`,
  );

  focusedNode?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  });
};

watch(
  () => props.focusedTableId,
  () => {
    void scrollFocusedNodeIntoView();
  },
);

const onNodeClick = (node: MapNodeItem): void => {
  if (isEditMode.value || activeDragId.value) return;
  if (node.tableId) {
    emit('focus-card', node.tableId);
  }
};

const getNodeStyle = (node: MapNodeItem): CSSProperties => {
  return {
    position: 'absolute',
    left: `${node.x}px`,
    top: `${node.y}px`,
    width: `${node.width}px`,
    height: `${node.height}px`,
    zIndex: activeDragId.value === node.id ? 100 : 10,
  };
};

const getWalkwayStyle = (walkway: WalkwayItem): CSSProperties => {
  const isSelected = selectedWalkwayId.value === walkway.id && isEditMode.value;
  return {
    position: 'absolute',
    left: `${walkway.x}px`,
    top: `${walkway.y}px`,
    width: `${walkway.width}px`,
    height: `${walkway.height}px`,
    zIndex: activeDragId.value === walkway.id ? 90 : isSelected ? 80 : 2,
  };
};

const checkOverlap = (nodeA: MapNodeItem, nodeB: MapNodeItem): boolean => {
  return (
    nodeA.x < nodeB.x + nodeB.width &&
    nodeA.x + nodeA.width > nodeB.x &&
    nodeA.y < nodeB.y + nodeB.height &&
    nodeA.y + nodeA.height > nodeB.y
  );
};

const validatePosition = (targetNode: MapNodeItem): boolean => {
  return nodes.value.some((node) => {
    if (node.id === targetNode.id) return false;
    return checkOverlap(targetNode, node);
  });
};

const startDragWalkway = (id: string, event: PointerEvent): void => {
  if (!isEditMode.value) return;
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);

  const walkway = walkways.value.find((w) => w.id === id);
  if (!walkway) return;

  activeDragId.value = id;
  selectedWalkwayId.value = id;
  dragOffset.value = {
    x: event.clientX - walkway.x,
    y: event.clientY - walkway.y,
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (activeDragId.value !== id || !canvasRef.value) return;

    if (animFrameId.value !== null) {
      cancelAnimationFrame(animFrameId.value);
    }

    animFrameId.value = requestAnimationFrame(() => {
      const bounds = canvasRef.value!.getBoundingClientRect();
      let newX = e.clientX - dragOffset.value.x;
      let newY = e.clientY - dragOffset.value.y;

      const snapGrid = 10;
      newX = Math.round(newX / snapGrid) * snapGrid;
      newY = Math.round(newY / snapGrid) * snapGrid;

      // Magnetic Walkway Edge-to-Edge Connection Snapping
      const snapThreshold = 14;
      walkways.value.forEach((other) => {
        if (other.id === id) return;

        // Snap left edge to right edge of other walkway
        if (Math.abs(newX - (other.x + other.width)) < snapThreshold) {
          newX = other.x + other.width;
        }
        // Snap right edge to left edge of other walkway
        if (Math.abs(newX + walkway.width - other.x) < snapThreshold) {
          newX = other.x - walkway.width;
        }
        // Snap top edge to bottom edge of other walkway
        if (Math.abs(newY - (other.y + other.height)) < snapThreshold) {
          newY = other.y + other.height;
        }
        // Snap bottom edge to top edge of other walkway
        if (Math.abs(newY + walkway.height - other.y) < snapThreshold) {
          newY = other.y - walkway.height;
        }
        // Align axes
        if (Math.abs(newX - other.x) < snapThreshold) {
          newX = other.x;
        }
        if (Math.abs(newY - other.y) < snapThreshold) {
          newY = other.y;
        }
      });

      newX = Math.max(0, Math.min(newX, bounds.width - walkway.width));
      newY = Math.max(0, Math.min(newY, bounds.height - walkway.height));

      walkway.x = newX;
      walkway.y = newY;
    });
  };

  const onPointerUp = (e: PointerEvent): void => {
    target.releasePointerCapture(e.pointerId);
    target.removeEventListener('pointermove', onPointerMove);
    target.removeEventListener('pointerup', onPointerUp);

    if (animFrameId.value !== null) {
      cancelAnimationFrame(animFrameId.value);
      animFrameId.value = null;
    }
    activeDragId.value = null;
  };

  target.addEventListener('pointermove', onPointerMove);
  target.addEventListener('pointerup', onPointerUp);
};

const startResizeWalkway = (
  id: string,
  edge: 'left' | 'right' | 'top' | 'bottom',
  event: PointerEvent,
): void => {
  if (!isEditMode.value) return;
  const target = event.target as HTMLElement;
  target.setPointerCapture(event.pointerId);

  const walkway = walkways.value.find((w) => w.id === id);
  if (!walkway) return;

  isResizing.value = true;

  const startClientX = event.clientX;
  const startClientY = event.clientY;
  const startX = walkway.x;
  const startY = walkway.y;
  const startW = walkway.width;
  const startH = walkway.height;
  const minSize = 20;

  const onPointerMove = (e: PointerEvent): void => {
    const dx = e.clientX - startClientX;
    const dy = e.clientY - startClientY;

    if (edge === 'right') {
      walkway.width = Math.max(minSize, startW + dx);
    } else if (edge === 'left') {
      const newW = Math.max(minSize, startW - dx);
      walkway.x = startX + (startW - newW);
      walkway.width = newW;
    } else if (edge === 'bottom') {
      walkway.height = Math.max(minSize, startH + dy);
    } else if (edge === 'top') {
      const newH = Math.max(minSize, startH - dy);
      walkway.y = startY + (startH - newH);
      walkway.height = newH;
    }
  };

  const onPointerUp = (): void => {
    target.releasePointerCapture(event.pointerId);
    target.removeEventListener('pointermove', onPointerMove);
    target.removeEventListener('pointerup', onPointerUp);
    isResizing.value = false;
  };

  target.addEventListener('pointermove', onPointerMove);
  target.addEventListener('pointerup', onPointerUp);
};

const startDrag = (nodeId: string, event: PointerEvent): void => {
  if (!isEditMode.value) return;
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);

  const node = nodes.value.find((n) => n.id === nodeId);
  if (!node) return;

  activeDragId.value = nodeId;
  isSnappingBack.value = false;
  dragOffset.value = {
    x: event.clientX - node.x,
    y: event.clientY - node.y,
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (activeDragId.value !== nodeId || !canvasRef.value) return;

    if (animFrameId.value !== null) {
      cancelAnimationFrame(animFrameId.value);
    }

    animFrameId.value = requestAnimationFrame(() => {
      const bounds = canvasRef.value!.getBoundingClientRect();
      let newX = e.clientX - dragOffset.value.x;
      let newY = e.clientY - dragOffset.value.y;

      // Magnetic 10px grid snapping
      const snapGrid = 10;
      newX = Math.round(newX / snapGrid) * snapGrid;
      newY = Math.round(newY / snapGrid) * snapGrid;

      // Bounds constraint
      newX = Math.max(0, Math.min(newX, bounds.width - node.width));
      newY = Math.max(0, Math.min(newY, bounds.height - node.height));

      node.x = newX;
      node.y = newY;
      customPositions.value[nodeId] = { x: newX, y: newY };

      // Real-time AABB Collision detection
      isColliding.value = validatePosition(node);
    });
  };

  const onPointerUp = (e: PointerEvent): void => {
    target.releasePointerCapture(e.pointerId);
    target.removeEventListener('pointermove', onPointerMove);
    target.removeEventListener('pointerup', onPointerUp);

    if (animFrameId.value !== null) {
      cancelAnimationFrame(animFrameId.value);
      animFrameId.value = null;
    }

    if (isColliding.value) {
      // Snapback animation to original start position if collision occurs
      isSnappingBack.value = true;
      node.x = node.startX;
      node.y = node.startY;
      customPositions.value[nodeId] = { x: node.startX, y: node.startY };
      setTimeout(() => {
        isSnappingBack.value = false;
        isColliding.value = false;
      }, 250);
    } else {
      // Save valid new position
      node.startX = node.x;
      node.startY = node.y;
      customPositions.value[nodeId] = { x: node.x, y: node.y };
    }

    activeDragId.value = null;
  };

  target.addEventListener('pointermove', onPointerMove);
  target.addEventListener('pointerup', onPointerUp);
};
</script>
