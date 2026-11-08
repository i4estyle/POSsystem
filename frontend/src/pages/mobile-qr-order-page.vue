<template>
  <q-page class="mobile-qr-page-backdrop">
    <div class="mobile-app-shell">
      <!-- 1. Sticky Restaurant & Table Header -->
      <header class="mobile-app-header">
        <div class="header-top-row">
          <div class="brand-cluster">
            <div class="brand-logo-circle">
              <q-icon name="restaurant" size="20px" />
            </div>
            <div>
              <div class="brand-name-row">
                <h1>Cafely Bistro &amp; Bar</h1>
              </div>
              <p class="brand-sub">
                {{ isEn ? 'Siam Main Branch' : 'สาขาหลัก สยาม' }}
              </p>
            </div>
          </div>

          <button type="button" class="lang-switch-pill" @click="toggleLocale">
            <q-icon name="translate" size="15px" />
            <span>{{ isEn ? 'EN' : 'TH' }}</span>
          </button>
        </div>

        <!-- Table & Diners Control Strip -->
        <div class="table-session-strip">
          <div class="table-badge-box">
            <q-icon name="table_restaurant" size="18px" />
            <div>
              <span class="badge-label">{{ isEn ? 'TABLE' : 'โต๊ะของคุณ' }}</span>
              <strong class="badge-num">{{ qrStore.tableNumber }}</strong>
            </div>
          </div>

          <div class="guest-stepper-box">
            <span class="badge-label">{{ isEn ? 'GUESTS' : 'จำนวนลูกค้า' }}</span>
            <div class="mini-stepper">
              <button type="button" @click="qrStore.setGuestCount(-1)">−</button>
              <strong>{{ qrStore.guestCount }} {{ isEn ? 'pax' : 'ท่าน' }}</strong>
              <button type="button" @click="qrStore.setGuestCount(1)">+</button>
            </div>
          </div>

          <div class="dining-mode-toggle">
            <button
              type="button"
              :class="{ active: qrStore.diningMode === 'dine_in' }"
              @click="qrStore.diningMode = 'dine_in'"
            >
              {{ isEn ? 'Dine-in' : 'ทานที่โต๊ะ' }}
            </button>
            <button
              type="button"
              :class="{ active: qrStore.diningMode === 'takeaway' }"
              @click="qrStore.diningMode = 'takeaway'"
            >
              {{ isEn ? 'Takeaway' : 'กลับบ้าน' }}
            </button>
          </div>
        </div>

        <!-- Live Kitchen Status & Running Bill Pill -->
        <button
          v-if="qrStore.orderRounds.length > 0"
          type="button"
          class="live-kitchen-banner"
          @click="activeTab = 'status'"
        >
          <div class="kitchen-banner-left">
            <span class="pulse-ring"></span>
            <span>
              {{
                qrStore.activeKitchenRoundsCount > 0
                  ? isEn
                    ? `Kitchen preparing ${qrStore.activeKitchenRoundsCount} order(s)`
                    : `กำลังทำอาหาร ${qrStore.activeKitchenRoundsCount} รอบออเดอร์`
                  : isEn
                    ? 'All ordered dishes served'
                    : 'เสิร์ฟอาหารครบทุกรายการแล้ว'
              }}
            </span>
          </div>
          <div class="kitchen-banner-right">
            <span>{{ isEn ? 'View Summary' : 'ดูสรุปยอด' }}</span>
            <strong>฿{{ qrStore.billSummary.grandTotal.toFixed(0) }}</strong>
            <q-icon name="chevron_right" size="18px" />
          </div>
        </button>
      </header>

      <!-- 2. Main Scrollable Viewport -->
      <main class="mobile-app-Viewport">
        <Transition name="mobile-tab-fade" mode="out-in">
          <!-- ==================== TAB 1: MENU ==================== -->
          <section v-if="activeTab === 'menu'" key="menu" class="tab-view menu-tab-view">
            <!-- Promo Carousel Strip -->
            <div v-if="activePromotions.length > 0" class="promo-scroll-strip">
              <div
                v-for="promo in activePromotions"
                :key="promo.id"
                class="mobile-promo-card"
                :class="{ applied: qrStore.appliedPromotion?.id === promo.id }"
                @click="toggleClaimPromo(promo)"
              >
                <div class="promo-card-left">
                  <span class="promo-tag">{{ promo.code }}</span>
                  <h4>{{ promo.title }}</h4>
                  <p>{{ promo.description }}</p>
                </div>
                <button type="button" class="promo-claim-btn">
                  {{
                    qrStore.appliedPromotion?.id === promo.id
                      ? isEn
                        ? 'Applied'
                        : 'ใช้แล้ว'
                      : isEn
                        ? 'Use'
                        : 'ใช้โค้ด'
                  }}
                </button>
              </div>
            </div>

            <!-- Search & Category Sticky Bar -->
            <div class="sticky-menu-controls">
              <div class="mobile-search-box">
                <q-icon name="search" size="19px" class="search-ic" />
                <input
                  v-model="menuSearch"
                  type="text"
                  :placeholder="
                    isEn ? 'Search dishes or drinks...' : 'ค้นหาเมนูอาหาร เครื่องดื่ม ของหวาน...'
                  "
                />
                <button v-if="menuSearch" type="button" class="clear-ic" @click="menuSearch = ''">
                  <q-icon name="close" size="16px" />
                </button>
              </div>

              <div class="category-chips-scroll">
                <button
                  type="button"
                  class="cat-chip"
                  :class="{ active: selectedCat === null }"
                  @click="selectedCat = null"
                >
                  <span>{{ isEn ? 'All Menu' : 'ทั้งหมด' }}</span>
                </button>
                <button
                  type="button"
                  class="cat-chip"
                  :class="{ active: selectedCat === -1 }"
                  @click="selectedCat = -1"
                >
                  <span>{{ isEn ? 'Recommended' : 'เมนูแนะนำ' }}</span>
                </button>
                <button
                  v-for="cat in productStore.categories"
                  :key="cat.categoryId"
                  type="button"
                  class="cat-chip"
                  :class="{ active: selectedCat === cat.categoryId }"
                  @click="selectedCat = cat.categoryId"
                >
                  <span>{{ cat.categoryName }}</span>
                </button>
              </div>
            </div>

            <!-- Recommended Section (when viewing All with no search) -->
            <div v-if="selectedCat === null && !menuSearch.trim()" class="popular-highlight-sec">
              <div class="sec-heading-row">
                <h2>{{ isEn ? 'Recommended Dishes' : 'เมนูยอดนิยมประจำร้าน' }}</h2>
                <span>{{ isEn ? 'Tap to customize' : 'แตะเพื่อเลือกรสชาติ' }}</span>
              </div>
              <div class="popular-horizontal-scroll">
                <article
                  v-for="pop in popularProducts"
                  :key="pop.productId"
                  class="pop-feature-card"
                  @click="openCustomizeSheet(pop)"
                >
                  <div class="pop-img-wrap">
                    <img :src="pop.imageUrl || ''" :alt="pop.productName" />
                    <span
                      v-if="qrStore.getProductCartQty(pop.productId) > 0"
                      class="in-cart-counter"
                    >
                      {{ qrStore.getProductCartQty(pop.productId) }}
                    </span>
                  </div>
                  <div class="pop-card-info">
                    <h4>{{ pop.productName }}</h4>
                    <div class="pop-price-row">
                      <strong>฿{{ pop.sellingPrice.toFixed(0) }}</strong>
                      <button type="button" class="pop-add-mini">
                        <q-icon name="add" size="16px" />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <!-- Main Product List -->
            <div class="menu-list-section">
              <div class="sec-heading-row">
                <h2>
                  {{ currentCategoryLabel }}
                  <small>({{ displayedProducts.length }})</small>
                </h2>
              </div>

              <div v-if="displayedProducts.length === 0" class="mobile-empty-box">
                <q-icon name="search_off" size="38px" class="empty-ic" />
                <p>{{ isEn ? 'No menu items match your search.' : 'ไม่พบเมนูที่ค้นหา' }}</p>
              </div>

              <div v-else class="mobile-menu-grid">
                <article
                  v-for="item in displayedProducts"
                  :key="item.productId"
                  class="mobile-dish-card"
                  :class="{ disabled: item.stockQuantity === 0 || item.status === 'inactive' }"
                  @click="openCustomizeSheet(item)"
                >
                  <div class="dish-img-box">
                    <img :src="item.imageUrl || ''" :alt="item.productName" loading="lazy" />
                    <span v-if="item.isPopular" class="dish-badge popular">
                      {{ isEn ? 'Popular' : 'ขายดี' }}
                    </span>
                    <span
                      v-if="item.stockQuantity === 0 || item.status === 'inactive'"
                      class="dish-soldout-overlay"
                    >
                      {{ isEn ? 'Sold Out' : 'หมดชั่วคราว' }}
                    </span>
                    <span
                      v-else-if="qrStore.getProductCartQty(item.productId) > 0"
                      class="in-cart-counter"
                    >
                      {{ qrStore.getProductCartQty(item.productId) }}
                    </span>
                  </div>

                  <div class="dish-content">
                    <div class="dish-text">
                      <h3>{{ item.productName }}</h3>
                      <p class="dish-meta">
                        {{ getCategoryName(item.categoryId) }} • {{ item.unit }}
                      </p>
                    </div>

                    <div class="dish-bottom-row">
                      <span class="dish-price">฿{{ item.sellingPrice.toFixed(0) }}</span>
                      <button
                        type="button"
                        class="dish-add-btn"
                        :disabled="item.stockQuantity === 0 || item.status === 'inactive'"
                        @click.stop="openCustomizeSheet(item)"
                      >
                        <q-icon name="add" size="18px" />
                        <span>{{ isEn ? 'Select' : 'เลือก' }}</span>
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <!-- ==================== TAB 2: CART (CURRENT ROUND) ==================== -->
          <section v-else-if="activeTab === 'cart'" key="cart" class="tab-view cart-tab-view">
            <div class="sec-heading-row">
              <div>
                <h2>{{ isEn ? 'Selected Items (This Round)' : 'รายการที่เลือก (รอบนี้)' }}</h2>
                <p class="sec-sub">
                  {{
                    isEn
                      ? 'Review your choices before sending to the kitchen.'
                      : 'ตรวจสอบรายการอาหารและกดยืนยันเพื่อส่งเข้าครัว'
                  }}
                </p>
              </div>
              <button
                v-if="qrStore.cartItems.length > 0"
                type="button"
                class="text-clear-btn"
                @click="qrStore.clearCart()"
              >
                <q-icon name="delete_sweep" size="16px" />
                {{ isEn ? 'Clear' : 'ล้างตะกร้า' }}
              </button>
            </div>

            <div v-if="qrStore.cartItems.length === 0" class="mobile-empty-box large">
              <q-icon name="shopping_bag" size="42px" class="empty-ic" />
              <h3>{{ isEn ? 'No items in tray yet' : 'ยังไม่มีรายการอาหารที่เลือก' }}</h3>
              <p>
                {{
                  isEn
                    ? 'Tap any dish on the menu to customize and add to your order.'
                    : 'เลือกเมนูที่ต้องการจากหน้าเมนูอาหารเพื่อเตรียมสั่งเข้าครัว'
                }}
              </p>
              <button type="button" class="primary-pill-btn" @click="activeTab = 'menu'">
                <q-icon name="restaurant_menu" size="18px" />
                <span>{{ isEn ? 'Browse Menu' : 'ไปหน้าเมนูอาหาร' }}</span>
              </button>
            </div>

            <template v-else>
              <div class="cart-items-list">
                <div
                  v-for="cItem in qrStore.cartItems"
                  :key="cItem.cartItemId"
                  class="mobile-cart-card"
                >
                  <img
                    :src="cItem.product.imageUrl || ''"
                    :alt="cItem.product.productName"
                    class="cart-card-thumb"
                  />
                  <div class="cart-card-body">
                    <div class="cart-card-top">
                      <h4>{{ cItem.product.productName }}</h4>
                      <strong>฿{{ (cItem.unitTotal * cItem.quantity).toFixed(0) }}</strong>
                    </div>

                    <div class="cart-custom-tags">
                      <span v-if="cItem.customization.sweetness" class="c-tag">
                        หวาน {{ cItem.customization.sweetness }}
                      </span>
                      <span v-if="cItem.customization.spiciness" class="c-tag">
                        {{ cItem.customization.spiciness }}
                      </span>
                      <span
                        v-for="addon in cItem.customization.addons"
                        :key="addon.id"
                        class="c-tag addon"
                      >
                        +{{ isEn ? addon.labelEn : addon.labelTh }} (+฿{{ addon.price }})
                      </span>
                      <span
                        v-for="ex in cItem.customization.excludedTags"
                        :key="ex"
                        class="c-tag exclude"
                      >
                        {{ ex }}
                      </span>
                    </div>

                    <p v-if="cItem.customization.note" class="cart-item-note">
                      <q-icon name="notes" size="13px" />
                      {{ cItem.customization.note }}
                    </p>

                    <div class="cart-card-actions">
                      <span class="unit-price-hint">
                        ฿{{ cItem.unitTotal }} / {{ cItem.product.unit }}
                      </span>
                      <div class="mini-qty-control">
                        <button
                          type="button"
                          class="q-btn-step"
                          @click="qrStore.updateCartItemQty(cItem.cartItemId, -1)"
                        >
                          <q-icon
                            :name="cItem.quantity === 1 ? 'delete_outline' : 'remove'"
                            size="16px"
                          />
                        </button>
                        <span>{{ cItem.quantity }}</span>
                        <button
                          type="button"
                          class="q-btn-step plus"
                          @click="qrStore.updateCartItemQty(cItem.cartItemId, 1)"
                        >
                          <q-icon name="add" size="16px" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Table Note for this Round -->
              <div class="round-note-card">
                <label>
                  <q-icon name="speaker_notes" size="16px" />
                  {{ isEn ? 'Note for this order round' : 'หมายเหตุถึงครัว (สำหรับรอบนี้)' }}
                </label>
                <input
                  v-model="qrStore.currentTableNote"
                  type="text"
                  class="sheet-note-input"
                  :placeholder="
                    isEn
                      ? 'e.g., Serve drinks first...'
                      : 'เช่น ขอเสิร์ฟเครื่องดื่มก่อน, ขอจานแบ่งเพิ่ม...'
                  "
                />
              </div>

              <!-- Send to Kitchen Action Box -->
              <div class="send-kitchen-box">
                <div class="send-summary-row">
                  <span>
                    {{
                      isEn
                        ? `Round #${qrStore.orderRounds.length + 1} (${qrStore.cartItemCount} items)`
                        : `ออเดอร์รอบที่ #${qrStore.orderRounds.length + 1} (${qrStore.cartItemCount} รายการ)`
                    }}
                  </span>
                  <strong>฿{{ qrStore.cartSubtotal.toFixed(2) }}</strong>
                </div>

                <button
                  type="button"
                  class="send-kitchen-cta"
                  :disabled="isSendingOrder"
                  @click="handleSendToKitchen"
                >
                  <q-spinner-dots v-if="isSendingOrder" color="white" size="22px" />
                  <template v-else>
                    <q-icon name="soup_kitchen" size="22px" />
                    <span>
                      {{ isEn ? 'Confirm & Send to Kitchen' : 'ยืนยันส่งออเดอร์เข้าครัว' }}
                    </span>
                    <span class="cta-price-badge">฿{{ qrStore.cartSubtotal.toFixed(0) }}</span>
                  </template>
                </button>
              </div>
            </template>
          </section>

          <!-- ==================== TAB 3: ORDER SUMMARY & STATUS ==================== -->
          <section v-else-if="activeTab === 'status'" key="status" class="tab-view status-tab-view">
            <div class="sec-heading-row">
              <div>
                <h2>{{ isEn ? 'Order Summary & Status' : 'สรุปรายการที่สั่ง & สถานะอาหาร' }}</h2>
                <p class="sec-sub">
                  {{
                    isEn
                      ? 'Check your ordered items and pay at the cashier counter when finished.'
                      : 'ตรวจสอบรายการอาหารที่สั่งทั้งหมดของโต๊ะ และชำระเงินที่เคาน์เตอร์แคชเชียร์'
                  }}
                </p>
              </div>
            </div>

            <div v-if="qrStore.orderRounds.length === 0" class="mobile-empty-box large">
              <q-icon name="receipt_long" size="42px" class="empty-ic" />
              <h3>
                {{ isEn ? 'No orders placed yet for this table' : 'โต๊ะนี้ยังไม่มีรายการที่สั่ง' }}
              </h3>
              <p>
                {{
                  isEn
                    ? 'Once you send an order to the kitchen, your summary and status will appear here.'
                    : 'เมื่อกดยืนยันส่งออเดอร์เข้าครัวแล้ว รายการอาหารและยอดรวมของโต๊ะจะแสดงที่นี่'
                }}
              </p>
              <button type="button" class="primary-pill-btn" @click="activeTab = 'menu'">
                <q-icon name="restaurant_menu" size="18px" />
                <span>{{ isEn ? 'Select Menu' : 'เลือกเมนูอาหาร' }}</span>
              </button>
            </div>

            <template v-else>
              <!-- Table Order Summary & Counter Payment Notice -->
              <div class="running-bill-card">
                <div class="bill-card-header">
                  <div>
                    <span class="bill-eyebrow">
                      {{ isEn ? 'TABLE ORDER SUMMARY' : 'สรุปยอดรายการอาหารของโต๊ะ' }}
                    </span>
                    <h3>
                      {{ isEn ? `Table ${qrStore.tableNumber}` : `โต๊ะ ${qrStore.tableNumber}` }} •
                      {{ qrStore.totalOrderedItemsCount }}
                      {{ isEn ? 'items' : 'รายการ' }}
                    </h3>
                  </div>
                  <span class="payment-status-chip">
                    {{ isEn ? 'Pay at Counter' : 'ชำระที่เคาน์เตอร์' }}
                  </span>
                </div>

                <div class="bill-lines">
                  <div class="bill-line">
                    <span>{{ isEn ? 'Subtotal' : 'รวมค่าอาหาร' }}</span>
                    <span>฿{{ qrStore.billSummary.subtotal.toFixed(2) }}</span>
                  </div>
                  <div v-if="qrStore.billSummary.discountAmount > 0" class="bill-line discount">
                    <span>
                      {{ isEn ? 'Discount' : 'ส่วนลดโปรโมชั่น' }}
                      ({{ qrStore.billSummary.appliedPromotion?.code }})
                    </span>
                    <span>-฿{{ qrStore.billSummary.discountAmount.toFixed(2) }}</span>
                  </div>
                  <div class="bill-line">
                    <span>{{ isEn ? 'VAT (7%)' : 'ภาษีมูลค่าเพิ่ม (7%)' }}</span>
                    <span>฿{{ qrStore.billSummary.taxAmount.toFixed(2) }}</span>
                  </div>
                  <div class="bill-line grand">
                    <span>{{ isEn ? 'Estimated Total' : 'ยอดรวมสุทธิ' }}</span>
                    <strong>฿{{ qrStore.billSummary.grandTotal.toFixed(2) }}</strong>
                  </div>
                </div>

                <!-- Split Bill Calculator Strip -->
                <div class="split-bill-strip">
                  <div class="split-left">
                    <q-icon name="groups" size="18px" />
                    <span>{{ isEn ? 'Split per person' : 'หารเฉลี่ยต่อท่าน' }}:</span>
                    <div class="mini-stepper dark">
                      <button type="button" @click="qrStore.setGuestCount(-1)">−</button>
                      <strong>{{ qrStore.guestCount }} {{ isEn ? 'pax' : 'ท่าน' }}</strong>
                      <button type="button" @click="qrStore.setGuestCount(1)">+</button>
                    </div>
                  </div>
                  <div class="split-right">
                    <strong>฿{{ qrStore.billSummary.perPersonAmount.toFixed(2) }}</strong>
                    <small>/ {{ isEn ? 'person' : 'ท่าน' }}</small>
                  </div>
                </div>

                <!-- Pay at Counter Instruction Banner -->
                <div class="counter-pay-notice">
                  <div class="counter-pay-icon">
                    <q-icon name="storefront" size="22px" />
                  </div>
                  <div class="counter-pay-text">
                    <strong>
                      {{
                        isEn
                          ? `Please pay at the Cashier Counter (Table ${qrStore.tableNumber})`
                          : `ชำระเงินที่เคาน์เตอร์แคชเชียร์ (แจ้งโต๊ะ ${qrStore.tableNumber})`
                      }}
                    </strong>
                    <span>
                      {{
                        isEn
                          ? 'Show this summary or tell your table number to the cashier when ready.'
                          : 'เมื่อทานเสร็จแล้ว สามารถแจ้งหมายเลขโต๊ะหรือแสดงหน้าสรุปนี้ที่เคาน์เตอร์ได้เลยครับ'
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Order Rounds Timeline -->
              <div class="rounds-list">
                <article
                  v-for="round in qrStore.orderRounds"
                  :key="round.roundId"
                  class="round-tracker-card"
                >
                  <header class="round-card-header">
                    <div>
                      <span class="round-pill">
                        {{ isEn ? `Round #${round.roundNumber}` : `รอบที่ #${round.roundNumber}` }}
                      </span>
                      <strong class="round-order-no">{{ round.orderNumber }}</strong>
                      <small class="round-time">{{ round.createdAt }}</small>
                    </div>

                    <span v-if="round.status === 'served'" class="served-complete-tag">
                      <q-icon name="check_circle" size="15px" />
                      {{ isEn ? 'Served' : 'เสิร์ฟครบแล้ว' }}
                    </span>
                    <span v-else class="cooking-active-tag">
                      {{
                        round.status === 'ready'
                          ? isEn
                            ? 'Ready to serve'
                            : 'พร้อมเสิร์ฟ'
                          : round.status === 'preparing'
                            ? isEn
                              ? 'Cooking'
                              : 'กำลังปรุง'
                            : isEn
                              ? 'Sent to kitchen'
                              : 'ส่งเข้าครัวแล้ว'
                      }}
                    </span>
                  </header>

                  <!-- 4-Step Visual Progress Stepper -->
                  <div class="kitchen-stepper">
                    <div
                      v-for="(st, idx) in statusSteps"
                      :key="st.key"
                      class="k-step"
                      :class="{
                        reached: getStepIndex(round.status) >= idx,
                        current: round.status === st.key,
                      }"
                    >
                      <div class="k-step-circle">
                        <q-icon :name="st.icon" size="15px" />
                      </div>
                      <span class="k-step-label">{{ isEn ? st.labelEn : st.labelTh }}</span>
                    </div>
                  </div>

                  <!-- Items in this Round -->
                  <div class="round-items-ul">
                    <div
                      v-for="rItem in round.items"
                      :key="rItem.cartItemId"
                      class="round-item-line"
                    >
                      <div class="r-item-left">
                        <span class="r-qty">{{ rItem.quantity }}x</span>
                        <div class="r-item-info">
                          <p class="r-name">{{ rItem.product.productName }}</p>
                          <div
                            v-if="getRoundItemTags(rItem.customization).length > 0"
                            class="r-mod-chips"
                          >
                            <span
                              v-for="(mTag, tIdx) in getRoundItemTags(rItem.customization)"
                              :key="tIdx"
                              class="r-mod-chip"
                              :class="mTag.type"
                            >
                              {{ mTag.label }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <strong class="r-price">
                        ฿{{ (rItem.unitTotal * rItem.quantity).toFixed(0) }}
                      </strong>
                    </div>
                  </div>

                  <p v-if="round.tableNote" class="round-footer-note">
                    <q-icon name="sticky_note_2" size="14px" />
                    {{ round.tableNote }}
                  </p>
                </article>
              </div>
            </template>
          </section>

          <!-- ==================== TAB 4: SELF-SERVICE REQUESTS ==================== -->
          <section
            v-else-if="activeTab === 'service'"
            key="service"
            class="tab-view service-tab-view"
          >
            <div class="sec-heading-row">
              <div>
                <h2>{{ isEn ? 'Table Service Requests' : 'ขออุปกรณ์เพิ่มที่โต๊ะ' }}</h2>
                <p class="sec-sub">
                  {{
                    isEn
                      ? 'Select items you need delivered to your table.'
                      : 'กดเลือกอุปกรณ์ที่ต้องการให้พนักงานนำมาเสิร์ฟที่โต๊ะ'
                  }}
                </p>
              </div>
            </div>

            <div class="service-quick-grid">
              <button
                v-for="srv in quickServiceCatalog"
                :key="srv.id"
                type="button"
                class="service-action-card"
                @click="handleQuickServiceRequest(srv)"
              >
                <div class="srv-icon-circle">
                  <q-icon :name="srv.icon" size="22px" />
                </div>
                <h4>{{ isEn ? srv.titleEn : srv.titleTh }}</h4>
                <span>{{ isEn ? srv.subEn : srv.subTh }}</span>
              </button>
            </div>

            <!-- Custom Request Input -->
            <div class="custom-request-box">
              <label>{{ isEn ? 'Additional note to staff' : 'แจ้งความต้องการเพิ่มเติม' }}</label>
              <div class="custom-req-row">
                <input
                  v-model="customServiceText"
                  type="text"
                  class="sheet-note-input"
                  :placeholder="
                    isEn
                      ? 'e.g., Extra baby chair, warm water...'
                      : 'เช่น ขอเก้าอี้เด็ก, ขอน้ำอุ่น, ขอเช็ดโต๊ะ...'
                  "
                  @keyup.enter="submitCustomServiceText"
                />
                <button
                  type="button"
                  class="send-custom-req-btn"
                  :disabled="!customServiceText.trim()"
                  @click="submitCustomServiceText"
                >
                  <q-icon name="send" size="18px" />
                </button>
              </div>
            </div>

            <!-- Active Service Requests History -->
            <div v-if="qrStore.serviceRequests.length > 0" class="service-history-sec">
              <h3>{{ isEn ? 'Recent Requests' : 'รายการที่ขอไปล่าสุด' }}</h3>
              <div class="service-req-list">
                <div v-for="req in qrStore.serviceRequests" :key="req.id" class="service-req-item">
                  <div class="req-item-left">
                    <q-icon :name="req.icon" size="20px" class="req-ic" />
                    <div>
                      <strong>{{ isEn ? req.titleEn : req.titleTh }}</strong>
                      <small>{{ req.createdAt }}</small>
                    </div>
                  </div>

                  <div class="req-item-right">
                    <span class="req-status-badge" :class="req.status">
                      {{
                        req.status === 'pending'
                          ? isEn
                            ? 'Sent'
                            : 'ส่งคำขอแล้ว'
                          : req.status === 'delivering'
                            ? isEn
                              ? 'On the way'
                              : 'กำลังนำไปเสิร์ฟ'
                            : isEn
                              ? 'Completed'
                              : 'ได้รับแล้ว'
                      }}
                    </span>
                    <button
                      v-if="req.status !== 'completed'"
                      type="button"
                      class="req-done-btn"
                      @click="qrStore.markServiceRequestCompleted(req.id)"
                    >
                      {{ isEn ? 'Received' : 'รับแล้ว' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Transition>
      </main>

      <!-- Floating Cart Bar (Visible on Menu tab when cart has items) -->
      <Transition name="floating-bar-pop">
        <div
          v-if="activeTab === 'menu' && qrStore.cartItemCount > 0"
          class="floating-cart-bar-wrap"
        >
          <button type="button" class="floating-cart-bar" @click="activeTab = 'cart'">
            <div class="fcb-left">
              <span class="fcb-count">{{ qrStore.cartItemCount }}</span>
              <div class="fcb-text">
                <strong>{{ isEn ? 'View Selected Items' : 'ดูรายการที่เลือกไว้' }}</strong>
                <small>{{
                  isEn ? 'Tap to review & send to kitchen' : 'แตะเพื่อตรวจสอบและส่งเข้าครัว'
                }}</small>
              </div>
            </div>
            <div class="fcb-right">
              <strong>฿{{ qrStore.cartSubtotal.toFixed(0) }}</strong>
              <q-icon name="arrow_forward_ios" size="14px" />
            </div>
          </button>
        </div>
      </Transition>

      <!-- 3. Bottom App Navigation Bar -->
      <nav class="mobile-bottom-nav">
        <button
          type="button"
          class="m-nav-item"
          :class="{ active: activeTab === 'menu' }"
          @click="activeTab = 'menu'"
        >
          <q-icon name="restaurant_menu" size="22px" />
          <span>{{ isEn ? 'Menu' : 'เมนูอาหาร' }}</span>
        </button>

        <button
          type="button"
          class="m-nav-item"
          :class="{ active: activeTab === 'cart' }"
          @click="activeTab = 'cart'"
        >
          <div class="nav-icon-badge-wrap">
            <q-icon name="shopping_bag" size="22px" />
            <span v-if="qrStore.cartItemCount > 0" class="m-nav-badge">
              {{ qrStore.cartItemCount }}
            </span>
          </div>
          <span>{{ isEn ? 'Tray' : 'ตะกร้า' }}</span>
        </button>

        <button
          type="button"
          class="m-nav-item"
          :class="{ active: activeTab === 'status' }"
          @click="activeTab = 'status'"
        >
          <div class="nav-icon-badge-wrap">
            <q-icon name="receipt_long" size="22px" />
            <span v-if="qrStore.orderRounds.length > 0" class="m-nav-badge pulse">
              {{ qrStore.orderRounds.length }}
            </span>
          </div>
          <span>{{ isEn ? 'Order Summary' : 'สรุปรายการสั่ง' }}</span>
        </button>

        <button
          type="button"
          class="m-nav-item"
          :class="{ active: activeTab === 'service' }"
          @click="activeTab = 'service'"
        >
          <div class="nav-icon-badge-wrap">
            <q-icon name="room_service" size="22px" />
            <span v-if="pendingServiceCount > 0" class="m-nav-badge secondary">
              {{ pendingServiceCount }}
            </span>
          </div>
          <span>{{ isEn ? 'Service' : 'ขออุปกรณ์เพิ่ม' }}</span>
        </button>
      </nav>
    </div>

    <!-- Product Customization Bottom Sheet -->
    <MobileItemSheet
      v-model="isItemSheetOpen"
      :product="customizingProduct"
      @confirm="onConfirmAddItem"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useProductStore } from '@/stores/product-store';
import { usePromotionStore, type PromotionItem } from '@/stores/promotion-store';
import { useQrOrderStore } from '@/stores/qr-order-store';
import type { ProductInterface } from '@/types/product';
import type { MobileCartCustomization, MobileOrderTab, TableRoundStatus } from '@/types/qr-order';
import MobileItemSheet from '@/components/mobile-order/mobile-item-sheet.vue';

const route = useRoute();
const $q = useQuasar();
const { locale } = useI18n();

const productStore = useProductStore();
const promotionStore = usePromotionStore();
const qrStore = useQrOrderStore();

const isEn = computed(() => locale.value.startsWith('en'));

const activeTab = ref<MobileOrderTab>('menu');
const selectedCat = ref<number | null>(null);
const menuSearch = ref('');

const isItemSheetOpen = ref(false);
const customizingProduct = ref<ProductInterface | null>(null);
const isSendingOrder = ref(false);
const customServiceText = ref('');

const statusSteps: {
  key: TableRoundStatus;
  icon: string;
  labelTh: string;
  labelEn: string;
}[] = [
  { key: 'sent', icon: 'send', labelTh: 'ส่งเข้าครัว', labelEn: 'Sent' },
  { key: 'preparing', icon: 'outdoor_grill', labelTh: 'กำลังปรุง', labelEn: 'Cooking' },
  { key: 'ready', icon: 'notifications_active', labelTh: 'พร้อมเสิร์ฟ', labelEn: 'Ready' },
  { key: 'served', icon: 'check_circle', labelTh: 'เสิร์ฟแล้ว', labelEn: 'Served' },
];

const quickServiceCatalog = [
  {
    id: 'utensils',
    icon: 'flatware',
    titleTh: 'ขอช้อนส้อม / ตะเกียบ',
    titleEn: 'Utensils & Chopsticks',
    subTh: '1 ชุดส่งที่โต๊ะ',
    subEn: '1 set to table',
  },
  {
    id: 'water_ice',
    icon: 'local_drink',
    titleTh: 'ขอน้ำแข็ง / น้ำเปล่า',
    titleEn: 'Ice & Drinking Water',
    subTh: 'เติมน้ำหรือน้ำแข็ง',
    subEn: 'Refill water or ice',
  },
  {
    id: 'plates',
    icon: 'album',
    titleTh: 'ขอจานแบ่ง / ถ้วยเล็ก',
    titleEn: 'Sharing Plates / Bowls',
    subTh: 'สำหรับแบ่งทานที่โต๊ะ',
    subEn: 'Extra side plates',
  },
  {
    id: 'napkins',
    icon: 'dry_cleaning',
    titleTh: 'ขอทิชชู่ / กระดาษเช็ดปาก',
    titleEn: 'Extra Napkins / Tissue',
    subTh: 'ทิชชู่สำหรับโต๊ะอาหาร',
    subEn: 'Table napkins',
  },
  {
    id: 'sauces',
    icon: 'liquor',
    titleTh: 'ขอซอสมะเขือเทศ / พริก',
    titleEn: 'Ketchup & Chili Sauce',
    subTh: 'ชุดเครื่องปรุงเพิ่มเติม',
    subEn: 'Condiment set',
  },
  {
    id: 'chair',
    icon: 'chair_alt',
    titleTh: 'ขอเก้าอี้เสริม / ที่วางกระเป๋า',
    titleEn: 'Extra Chair / Bag Basket',
    subTh: 'อำนวยความสะดวกที่โต๊ะ',
    subEn: 'Table comfort item',
  },
];

const activePromotions = computed(() =>
  promotionStore.promotions.filter((p) => p.status === 'active'),
);

const popularProducts = computed(() =>
  productStore.products.filter((p) => p.isPopular && p.status === 'active'),
);

const displayedProducts = computed(() => {
  let list = productStore.products;
  if (selectedCat.value === -1) {
    list = list.filter((p) => p.isPopular);
  } else if (selectedCat.value !== null) {
    list = list.filter((p) => p.categoryId === selectedCat.value);
  }

  if (menuSearch.value.trim()) {
    const q = menuSearch.value.toLowerCase().trim();
    list = list.filter(
      (p) => p.productName.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }
  return list;
});

const currentCategoryLabel = computed(() => {
  if (selectedCat.value === null) return isEn.value ? 'All Dishes & Drinks' : 'เมนูอาหารทั้งหมด';
  if (selectedCat.value === -1) return isEn.value ? 'Recommended Dishes' : 'เมนูแนะนำ';
  const found = productStore.categories.find((c) => c.categoryId === selectedCat.value);
  return found ? found.categoryName : '';
});

const pendingServiceCount = computed(
  () => qrStore.serviceRequests.filter((r) => r.status !== 'completed').length,
);

const syncTableFromQuery = (): void => {
  const qId = Number(route.query.tableId);
  const qNum = typeof route.query.tableNumber === 'string' ? route.query.tableNumber : undefined;
  qrStore.initTableSession(qId || 1, qNum || `T-0${qId || 1}`);
};

let statusPollTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  syncTableFromQuery();
  statusPollTimer = setInterval(() => {
    void qrStore.syncRoundsStatusFromBackend();
  }, 3500);
});

onUnmounted(() => {
  if (statusPollTimer) clearInterval(statusPollTimer);
});

watch(
  () => [route.query.tableId, route.query.tableNumber],
  () => {
    syncTableFromQuery();
  },
);

const toggleLocale = (): void => {
  locale.value = isEn.value ? 'th' : 'en-US';
};

const getCategoryName = (catId: number): string => {
  const c = productStore.categories.find((cat) => cat.categoryId === catId);
  return c ? c.categoryName : 'เมนูอาหาร';
};

const openCustomizeSheet = (product: ProductInterface): void => {
  if (product.stockQuantity === 0 || product.status === 'inactive') {
    $q.notify({
      type: 'warning',
      message: isEn.value
        ? `${product.productName} is temporarily sold out`
        : `ขออภัย เมนู ${product.productName} หมดชั่วคราว`,
      position: 'top',
    });
    return;
  }
  customizingProduct.value = product;
  isItemSheetOpen.value = true;
};

const onConfirmAddItem = (payload: {
  product: ProductInterface;
  quantity: number;
  customization: MobileCartCustomization;
}): void => {
  qrStore.addCustomizedItemToCart(payload.product, payload.quantity, payload.customization);
  $q.notify({
    type: 'positive',
    message: isEn.value
      ? `Added ${payload.quantity}x ${payload.product.productName}`
      : `เพิ่ม ${payload.product.productName} x${payload.quantity} ลงตะกร้าแล้ว`,
    position: 'top',
    timeout: 1400,
  });
};

const toggleClaimPromo = (promo: PromotionItem): void => {
  if (qrStore.appliedPromotion?.id === promo.id) {
    qrStore.appliedPromotion = null;
    $q.notify({
      type: 'warning',
      message: isEn.value ? 'Removed promotion code' : 'ยกเลิกการใช้โค้ดส่วนลดแล้ว',
      position: 'top',
    });
  } else {
    qrStore.appliedPromotion = promo;
    $q.notify({
      type: 'positive',
      message: isEn.value ? `Promo ${promo.code} applied!` : `ใช้โค้ดส่วนลด ${promo.code} แล้ว`,
      position: 'top',
    });
  }
};

const handleSendToKitchen = async (): Promise<void> => {
  isSendingOrder.value = true;
  const round = await qrStore.submitRoundToKitchen();
  isSendingOrder.value = false;

  if (round) {
    activeTab.value = 'status';
    $q.notify({
      type: 'positive',
      message: isEn.value
        ? `Order ${round.orderNumber} sent to the kitchen!`
        : `ส่งออเดอร์ ${round.orderNumber} เข้าครัวเรียบร้อยแล้ว!`,
      position: 'top',
    });
  }
};

const getStepIndex = (status: TableRoundStatus): number => {
  const order: TableRoundStatus[] = ['sent', 'preparing', 'ready', 'served'];
  return order.indexOf(status);
};

const getRoundItemTags = (
  c: MobileCartCustomization,
): { label: string; type: 'flavor' | 'addon' | 'exclude' }[] => {
  const tags: { label: string; type: 'flavor' | 'addon' | 'exclude' }[] = [];
  if (c.sweetness) tags.push({ label: `หวาน ${c.sweetness}`, type: 'flavor' });
  if (c.spiciness) tags.push({ label: c.spiciness, type: 'flavor' });
  for (const addon of c.addons) {
    tags.push({ label: `+${isEn.value ? addon.labelEn : addon.labelTh}`, type: 'addon' });
  }
  for (const ex of c.excludedTags) {
    tags.push({ label: ex, type: 'exclude' });
  }
  if (c.note) {
    const splitNotes = c.note
      .split(/[|,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const n of splitNotes) {
      const type =
        n.startsWith('+') || n.includes('เพิ่ม')
          ? 'addon'
          : n.startsWith('ไม่') || n.startsWith('แยก')
            ? 'exclude'
            : 'flavor';
      tags.push({ label: n, type });
    }
  }
  return tags;
};

const handleQuickServiceRequest = (srv: {
  icon: string;
  titleTh: string;
  titleEn: string;
}): void => {
  qrStore.sendSelfServiceRequest({
    icon: srv.icon,
    titleTh: srv.titleTh,
    titleEn: srv.titleEn,
    quantity: 1,
  });
  $q.notify({
    type: 'positive',
    message: isEn.value ? `Request sent: ${srv.titleEn}` : `ส่งคำขอ "${srv.titleTh}" เรียบร้อยแล้ว`,
    position: 'top',
    timeout: 1600,
  });
};

const submitCustomServiceText = (): void => {
  const text = customServiceText.value.trim();
  if (!text) return;
  qrStore.sendSelfServiceRequest({
    icon: 'chat_bubble_outline',
    titleTh: text,
    titleEn: text,
    quantity: 1,
  });
  customServiceText.value = '';
  $q.notify({
    type: 'positive',
    message: isEn.value ? 'Note sent to staff!' : 'ส่งข้อความแจ้งพนักงานเรียบร้อยแล้ว',
    position: 'top',
  });
};
</script>
