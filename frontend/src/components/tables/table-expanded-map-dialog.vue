<template>
  <q-dialog
    :model-value="modelValue"
    maximized
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="expanded-map-card">
      <q-card-section class="expanded-header">
        <div class="header-text">
          <div class="title-row">
            <h2 class="dialog-title">
              {{ t('tables.floorMap.expandedTitle', { branch: branchName }) }}
            </h2>
            <span v-if="isEditMode" class="editing-badge">
              <q-icon name="edit" size="14px" />
              {{ t('tables.floorMap.editingBadge') }}
            </span>
            <span v-if="isColliding" class="collision-badge">
              <q-icon name="warning" size="14px" />
              {{ t('tables.floorMap.collisionNotice') }}
            </span>
          </div>
          <small class="dialog-subtitle">
            {{ t('tables.floorMap.expandedSubtitle') }}
          </small>
        </div>

        <section class="header-actions">
          <section class="map-legend">
            <span class="legend-item active">
              <span class="legend-dot"></span>
              {{ t('tables.floorMap.legendActive') }}
            </span>
            <span class="legend-item ready">
              <span class="legend-dot"></span>
              {{ t('tables.floorMap.legendReady') }}
            </span>
          </section>

          <GradientButton
            :label="isEditMode ? t('tables.floorMap.doneEdit') : t('tables.floorMap.editMap')"
            :icon="isEditMode ? 'check' : 'edit'"
            :variant="isEditMode ? 'primary' : 'secondary'"
            @click="toggleEditMode"
          />

          <button v-if="isEditMode" type="button" class="reset-map-btn" @click="resetLayout">
            <q-icon name="restart_alt" size="16px" />
            <span>{{ t('tables.floorMap.resetMap') }}</span>
          </button>

          <q-btn v-close-popup flat round icon="close" size="md" class="close-btn" />
        </section>
      </q-card-section>

      <q-card-section class="expanded-body">
        <section ref="canvasRef" class="large-map-canvas" :class="{ 'grid-active': isEditMode }">
          <div class="large-map-nodes-container">
            <article
              v-for="node in nodes"
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
                },
              ]"
              :style="getNodeStyle(node)"
              @pointerdown="(e) => startDrag(node.id, e)"
            >
              <q-icon v-if="node.icon" :name="node.icon" size="24px" />
              <span>{{ node.labelKey ? t(node.labelKey) : node.label }}</span>
            </article>
          </div>
        </section>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from 'vue';
import { useI18n } from 'vue-i18n';
import GradientButton from '@/components/base/gradient-button.vue';

const { t } = useI18n();

defineProps<{
  modelValue: boolean;
  branchName: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

interface MapNodeItem {
  id: string;
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

const isEditMode = ref(false);
const isColliding = ref(false);
const isSnappingBack = ref(false);
const canvasRef = ref<HTMLElement | null>(null);
const activeDragId = ref<string | null>(null);
const dragOffset = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const animFrameId = ref<number | null>(null);

const defaultNodes: MapNodeItem[] = [
  {
    id: 'bar',
    labelKey: 'tables.floorMap.mainBar',
    icon: 'local_bar',
    typeClass: 'node-bar',
    statusClass: 'bar',
    width: 240,
    height: 90,
    x: 30,
    y: 30,
    startX: 30,
    startY: 30,
  },
  {
    id: 't1',
    label: 'T1',
    typeClass: 'node-table',
    statusClass: 'ready',
    width: 140,
    height: 75,
    x: 300,
    y: 30,
    startX: 300,
    startY: 30,
  },
  {
    id: 't2',
    label: 'T2',
    typeClass: 'node-table',
    statusClass: 'ready',
    width: 140,
    height: 75,
    x: 470,
    y: 30,
    startX: 470,
    startY: 30,
  },
  {
    id: 't3',
    label: 'T3',
    typeClass: 'node-table',
    statusClass: 'active',
    width: 140,
    height: 75,
    x: 640,
    y: 30,
    startX: 640,
    startY: 30,
  },
  {
    id: 't4',
    label: 'T4',
    typeClass: 'node-table',
    statusClass: 'active',
    width: 140,
    height: 75,
    x: 810,
    y: 30,
    startX: 810,
    startY: 30,
  },
  {
    id: 't6',
    label: 'T6',
    typeClass: 'node-table',
    statusClass: 'ready',
    width: 140,
    height: 75,
    x: 30,
    y: 150,
    startX: 30,
    startY: 150,
  },
  {
    id: 't5',
    label: 'T5',
    typeClass: 'node-table table-t5',
    statusClass: 'ready',
    width: 260,
    height: 120,
    x: 300,
    y: 150,
    startX: 300,
    startY: 150,
  },
  {
    id: 't7',
    label: 'T7',
    typeClass: 'node-table',
    statusClass: 'active',
    width: 140,
    height: 75,
    x: 590,
    y: 150,
    startX: 590,
    startY: 150,
  },
  {
    id: 't8',
    label: 'T8',
    typeClass: 'node-table',
    statusClass: 'ready',
    width: 140,
    height: 75,
    x: 760,
    y: 150,
    startX: 760,
    startY: 150,
  },
];

const nodes = ref<MapNodeItem[]>(JSON.parse(JSON.stringify(defaultNodes)));

const toggleEditMode = (): void => {
  isEditMode.value = !isEditMode.value;
};

const resetLayout = (): void => {
  nodes.value = JSON.parse(JSON.stringify(defaultNodes));
  isColliding.value = false;
};

const getNodeStyle = (node: MapNodeItem): CSSProperties => {
  return {
    position: 'absolute',
    left: `${node.x}px`,
    top: `${node.y}px`,
    width: `${node.width}px`,
    height: `${node.height}px`,
    zIndex: activeDragId.value === node.id ? 10 : 1,
  };
};

const checkAabbOverlap = (a: MapNodeItem, newX: number, newY: number): boolean => {
  const margin = 10;
  const aLeft = newX;
  const aRight = newX + a.width;
  const aTop = newY;
  const aBottom = newY + a.height;

  for (const b of nodes.value) {
    if (b.id === a.id) continue;
    const bLeft = b.x;
    const bRight = b.x + b.width;
    const bTop = b.y;
    const bBottom = b.y + b.height;

    const overlapX = aLeft < bRight - margin && aRight > bLeft + margin;
    const overlapY = aTop < bBottom - margin && aBottom > bTop + margin;

    if (overlapX && overlapY) {
      return true;
    }
  }
  return false;
};

const startDrag = (id: string, e: PointerEvent): void => {
  if (!isEditMode.value) return;

  const targetNode = nodes.value.find((n) => n.id === id);
  if (!targetNode || !canvasRef.value) return;

  activeDragId.value = id;
  targetNode.startX = targetNode.x;
  targetNode.startY = targetNode.y;

  const rect = canvasRef.value.getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - rect.left - targetNode.x,
    y: e.clientY - rect.top - targetNode.y,
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', stopDrag);
};

const onPointerMove = (e: PointerEvent): void => {
  if (!activeDragId.value || !isEditMode.value || !canvasRef.value) return;
  const targetNode = nodes.value.find((n) => n.id === activeDragId.value);
  if (!targetNode) return;

  if (animFrameId.value) cancelAnimationFrame(animFrameId.value);

  animFrameId.value = requestAnimationFrame(() => {
    if (!canvasRef.value || !targetNode) return;
    const rect = canvasRef.value.getBoundingClientRect();

    const rawX = e.clientX - rect.left - dragOffset.value.x;
    const rawY = e.clientY - rect.top - dragOffset.value.y;

    const snappedX = Math.max(10, Math.round(rawX / 20) * 20);
    const snappedY = Math.max(10, Math.round(rawY / 20) * 20);

    targetNode.x = snappedX;
    targetNode.y = snappedY;

    isColliding.value = checkAabbOverlap(targetNode, snappedX, snappedY);
  });
};

const stopDrag = (): void => {
  if (!activeDragId.value) return;
  const targetNode = nodes.value.find((n) => n.id === activeDragId.value);

  if (targetNode && isColliding.value) {
    isSnappingBack.value = true;
    targetNode.x = targetNode.startX;
    targetNode.y = targetNode.startY;
    setTimeout(() => {
      isSnappingBack.value = false;
      isColliding.value = false;
    }, 250);
  } else {
    isColliding.value = false;
  }

  activeDragId.value = null;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', stopDrag);
};
</script>
