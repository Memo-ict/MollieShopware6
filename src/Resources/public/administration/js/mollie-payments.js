(this.webpackJsonp=this.webpackJsonp||[]).push([["mollie-payments"],{"+iPB":function(e,t){e.exports="{% block sw_order_detail_base_secondary_info_payment %}\n    {% parent %}\n\n    <template v-if=\"mollieOrderId\">\n        <dt>{{ $tc('sw-order.detailExtended.labelMollieOrderId') }}</dt>\n        <dd>{{ mollieOrderId }}</dd>\n    </template>\n{% endblock %}"},"/Kex":function(e,t){e.exports='{% block sw_order_line_items_grid_actions %}\n    {% parent %}\n\n    <sw-container class="sw-order-line-items-grid__actions-container"\n                  columns="1fr auto"\n                  gap="16px"\n                  v-show="!editable">\n\n        {% block sw_order_line_items_grid_line_item_filter %}\n            {% parent %}\n        {% endblock %}\n\n        {% block sw_order_line_items_grid_actions_actions %}\n            <div align="right">\n                <sw-button-group :disabled="isLoading">\n                    <sw-button class="sw-order-line-items-grid__actions-container-refund-btn"\n                               variant="ghost"\n                               size="small"\n                               :disabled="!isRefundable"\n                               v-if="isMollieOrder"\n                               @click="onOpenRefundModal">\n                        <sw-icon name="default-arrow-360-left" decorative>\n                        </sw-icon>\n                        {{ $tc(\'mollie-payments.general.refundThroughMollie\') }}\n                    </sw-button>\n                </sw-button-group>\n            </div>\n        {% endblock %}\n    </sw-container>\n\n    <sw-modal v-if="showRefundModal"\n              @modal-close="onCloseRefundModal"\n              :title="$tc(\'mollie-payments.modals.refund.title\')"\n              :variant="refunds.length > 0 ? \'large\' : \'small\'">\n        <sw-container columns="1fr auto" :gap="refunds.length > 0 ? \'16px\' : \'0\'">\n            <sw-data-grid\n                :dataSource="refunds"\n                :columns="getRefundListColumns"\n                :showSelection="false"\n                v-if="refunds.length > 0">\n                <template #column-amount.value="{ item }">\n                    <sw-container columns="1fr auto" gap="8px" align="center">\n                        {{ item.amount.value | currency(item.amount.currency) }}\n                        <sw-help-text :text="item.description"></sw-help-text>\n                    </sw-container>\n                </template>\n                <template #column-status="{ item }">\n                    <sw-container columns="1fr auto" gap="8px" align="center">\n                        {{ getStatus(item.status) }}\n                        <sw-help-text :text="getStatusDescription(item.status)"></sw-help-text>\n                    </sw-container>\n                </template>\n                <template #column-createdAt="{ item }">\n                    {{ item.createdAt | date({hour: \'2-digit\', minute: \'2-digit\'}) }}\n                </template>\n                <template #actions="{ item }">\n                    <sw-context-menu-item :disabled="!isRefundCancelable(item)"\n                                          variant="danger"\n                                          @click="cancelRefund(item)">\n                        {{ $tc(\'mollie-payments.modals.refund.list.context.cancel\') }}\n                    </sw-context-menu-item>\n                </template>\n            </sw-data-grid>\n            <div>\n                <sw-description-list grid="225px 1fr"\n                                     v-if="!isLoading"\n                                     class="sw-order-detail__summary-data">\n                    {% block sw_order_line_items_grid_refund_summary %}\n                        {% block sw_order_line_items_grid_refund_summary_amount_total %}\n                            <template v-if="order.price.taxStatus !== \'tax-free\'">\n                                <dt>{{ $tc(\'sw-order.detailBase.summaryLabelAmountTotal\') }}</dt>\n                                <dd>{{ order.amountTotal | currency(order.currency.shortName) }}</dd>\n                            </template>\n                        {% endblock %}\n\n                        {% block sw_order_line_items_grid_refund_summary_amount_free_tax %}\n                            <template v-if="order.price.taxStatus === \'tax-free\'">\n                                <dt>{{ $tc(\'sw-order.detailBase.summaryLabelAmount\') }}</dt>\n                                <dd>{{ order.positionPrice | currency(order.currency.translated.shortName) }}</dd>\n                            </template>\n                        {% endblock %}\n\n                        {% block sw_order_line_items_grid_refund_summary_amount_refunded %}\n                            <dt>{{ $tc(\'sw-order.detailExtended.totalRefunds\') }}</dt>\n                            <dd>{{ refundedAmount | currency(order.currency.shortName) }}</dd>\n                        {% endblock %}\n\n                        {% block sw_order_line_items_grid_refund_summary_amount_remaining %}\n                            <dt>{{ $tc(\'sw-order.detailExtended.totalRemaining\') }}</dt>\n                            <dd>\n                                <sw-container columns="1fr auto" gap="16px" align="center">\n                                    {{ remainingAmount | currency(order.currency.shortName) }}\n                                    <sw-help-text :text="$tc(\'sw-order.detailExtended.totalRemainingHelpText\')"></sw-help-text>\n                                </sw-container>\n                            </dd>\n                        {% endblock %}\n                    {% endblock %}\n                </sw-description-list>\n\n                <sw-number-field\n                    :min="0"\n                    :max="remainingAmount"\n                    v-model="refundAmount"\n                    numberType="float"\n                    size="medium"\n                    :step="1"\n                    :placeholder="$tc(\'mollie-payments.modals.refund.quantityPlaceholder\')">\n                    <template #suffix>\n                        {{ order.currency.symbol }}\n                    </template>\n                </sw-number-field>\n            </div>\n        </sw-container>\n\n        <template slot="modal-footer">\n            <sw-button @click="onCloseRefundModal" size="small">\n                {{ $tc(\'mollie-payments.modals.refund.cancelButton\') }}\n            </sw-button>\n            <sw-button @click="onConfirmRefund()" variant="primary" size="small" :disabled="refundAmount == 0">\n                {{ $tc(\'mollie-payments.modals.refund.confirmButton\') }}\n            </sw-button>\n        </template>\n    </sw-modal>\n{% endblock %}\n\n{% block sw_order_line_items_grid_grid_actions %}\n    {% parent %}\n\n    <template #action-modals="{ item }">\n        <sw-modal v-if="showShippingModal === item.id"\n                  @modal-close="onCloseShippingModal"\n                  :title="$tc(\'mollie-payments.modals.shipping.title\')"\n                  variant="small">\n            <p>\n                {{ $tc(\'mollie-payments.modals.shipping.content\', 0, {\n                    quantity: item.quantity,\n                    shippableQuantity: shippableQuantity(item)\n                }) }}\n            </p>\n\n            <sw-number-field numberType="integer"\n                             size="medium"\n                             :step="1"\n                             :placeholder="$tc(\'mollie-payments.modals.shipping.quantityPlaceholder\')"\n                             :min="0"\n                             :value="1"\n                             :max="shippableQuantity(item)"\n                             v-model="quantityToShip">\n            </sw-number-field>\n\n            <template slot="modal-footer">\n                <sw-button @click="onCloseShippingModal" size="small">\n                    {{ $tc(\'mollie-payments.modals.shipping.cancelButton\') }}\n                </sw-button>\n                <sw-button @click="onConfirmShipping(item)" variant="primary" size="small">\n                    {{ $tc(\'mollie-payments.modals.shipping.confirmButton\') }}\n                </sw-button>\n            </template>\n        </sw-modal>\n    </template>\n{% endblock %}\n\n{% block sw_order_line_items_grid_grid_actions_show %}\n    {% parent %}\n\n    <sw-context-menu-item :disabled="!isShippable(item)"\n                          icon="default-object-paperplane"\n                          @click="onShipItem(item)">\n        {{ $tc(\'mollie-payments.general.shipThroughMollie\') }}\n    </sw-context-menu-item>\n{% endblock %}\n\n'},"6M4d":function(e){e.exports=JSON.parse('{"mollie-payments":{"general":{"mainMenuItemGeneral":"Mollie Payments","descriptionTextModule":"Mollie Payments","refundThroughMollie":"Refund through Mollie","shipThroughMollie":"Ship through Mollie"},"modals":{"refund":{"title":"Refund through Mollie","content":"Fill out the quantity of this item ({refundableQuantity} out of {quantity} left to refund) to be refunded to the customer.","success":"A refund has been created in Mollie. It may take 2 hours for the refund to complete. Until this time, you can cancel the refund in your Mollie Dashboard.","error":"Something went wrong creating a refund.","confirmButton":"Refund","cancelButton":"Do not refund","list":{"column":{"amount":"Amount","status":"Status","date":"Date"},"context":{"cancel":"Cancel this refund"},"status":{"queued":"Queued","pending":"Pending","processing":"Processing","refunded":"Refunded","failed":"Failed"},"status-description":{"queued":"The refund is queued until there is enough balance to process te refund. You can still cancel the refund.","pending":"The refund will be sent to the bank on the next business day. You can still cancel the refund.","processing":"The refund has been sent to the bank. The refund amount will be transferred to the consumer account as soon as possible.","refunded":"The refund amount has been transferred to the consumer.","failed":"The refund has failed after processing. For example, the customer has closed his / her bank account. The funds will be returned to your account."}}},"shipping":{"title":"Ship an order line item through Mollie","content":"Fill out the quantity of this item ({shippableQuantity} out of {quantity} left to ship) to be shipped to the customer.","quantityPlaceholder":"The quantity to ship...","confirmButton":"Ship","cancelButton":"Do not ship"}}},"sw-order":{"detailExtended":{"columnRefunded":"Refunded","columnShipped":"Shipped","labelMollieOrderId":"Mollie Order ID","totalRefunds":"Refunded amount","totalRemaining":"Refundable amount","totalRemainingHelpText":"You can refund up to € 25 extra with Mollie.","totalShipments":"Shipped amount ({quantity} items)"}},"sw-payment":{"testButton":"Test","testApiKeys":{"title":"Mollie Payments","apiKey":"API key","isValid":"is valid","isInvalid":"is invalid"}},"sw-customer":{"extendedInfo":{"labelPreferredIdealIssuer":"Preferred iDeal issuer"}}}')},ExJP:function(e){e.exports=JSON.parse('{"mollie-payments":{"general":{"mainMenuItemGeneral":"Mollie Payments Zahlungen","descriptionTextModule":"Mollie Payments Zahlungen","refundThroughMollie":"Rückerstattung über Mollie","shipThroughMollie":"Versand bei Mollie melden"},"modals":{"refund":{"title":"Rückerstattung über Mollie","content":"Menge dieser Bestellposition ({refundableQuantity} von {quantity} für Rückerstattung möglich) für die Rückerstattung an den Kunden.","success":"Es wurde eine Rückerstattung bei Mollie erstellt. Es kann bis zu 2 Stunden dauern, bis die Rückerstattung abgeschlossen ist. Bis dahin können Sie die Rückerstattung in Ihrem Mollie Dashboard stornieren.","error":"Beim Erstellen einer Rückerstattung ist etwas schief gelaufen.","confirmButton":"Rückerstatten","cancelButton":"Abbrechen","list":{"column":{"amount":"Betrag","status":"Status","date":"Datum"},"context":{"cancel":"Diese Rückerstattung stornieren"},"status":{"queued":"Warteschlange","pending":"Ausstehend","processing":"Processing","refunded":"Erstattet","failed":"Gescheitert"},"status-description":{"queued":"Die Rückerstattung steht in der Warteschlange, bis genügend Guthaben vorhanden ist, um die Rückerstattung zu verarbeiten. Sie können die Rückerstattung noch stornieren.","pending":"Die Rückerstattung wird am nächsten Werktag an die Bank gesendet. Sie können die Rückerstattung immer noch stornieren.","processing":"Die Rückerstattung wurde an die Bank gesendet. Der Rückerstattungsbetrag wird so schnell wie möglich auf das Kundenkonto überwiesen.","refunded":"Der Rückerstattungsbetrag wurde an den Kunden überwiesen.","failed":"Die Rückerstattung ist nach der Bearbeitung fehlgeschlagen. Zum Beispiel hat der Kunde sein Bankkonto geschlossen. Das Geld wird auf das Konto zurücküberwiesen."}}},"shipping":{"title":"Versand der Bestellposition an Mollie melden","content":"Menge dieser Bestellposition ({shippableQuantity} von {quantity} für Versand noch möglich), die an den Kunden versandt wurden.","quantityPlaceholder":"Menge der versendeten Ware...","confirmButton":"Versandmeldung bei Mollie","cancelButton":"Abbrechen"}}},"sw-order":{"detailExtended":{"columnRefunded":"Rückerstattet","columnShipped":"Versandt","labelMollieOrderId":"Mollie Bestell ID","totalRefunds":"Rückerstattete Menge","totalRemaining":"Rückerstattbar","totalRemainingHelpText":"Sie können mit Mollie bis zu 25 € auf den Totalbetrag zurückzahlen.","totalShipments":"Versandte Menge ({quantity} Stück)"}},"sw-payment":{"testButton":"Prüfung","testApiKeys":{"title":"Mollie Payments","apiKey":"API Schlüssel","isValid":"ist gültig","isInvalid":"ist gültig"}},"sw-customer":{"extendedInfo":{"labelPreferredIdealIssuer":"Bevorzugter iDeal Aussteller"}}}')},GE23:function(e,t){e.exports='<sw-button @click="onTestButtonClicked" ref="testApiButton">\n    {{ $tc(\'sw-payment.testButton\') }}\n</sw-button>\n'},TxRs:function(e,t){e.exports='{% block sw_customer_base_metadata_default_payment %}\n    {% parent %}\n    <sw-description-list v-if="preferredIdealIssuer">\n        <dt class="sw-customer-base-info__label">{{ $tc(\'sw-customer.extendedInfo.labelPreferredIdealIssuer\') }}</dt>\n        <dd class="sw-customer-base__label-preferred-ideal-issuer">\n            {{ preferredIdealIssuer }}\n        </dd>\n    </sw-description-list>\n{% endblock %}'},ab5s:function(e,t,n){"use strict";n.r(t);const i=Shopware.Classes.ApiService;var s=class extends i{constructor(e,t,n="mollie"){super(e,t,n)}testApiKeys(e={liveApiKey:null,testApiKey:null}){const t=this.getBasicHeaders();return this.httpClient.post(`_action/${this.getApiBasePath()}/config/test-api-keys`,JSON.stringify(e),{headers:t}).then((e=>i.handleResponse(e)))}};const r=Shopware.Classes.ApiService;var o=class extends r{constructor(e,t,n="mollie"){super(e,t,n)}__post(e="",t={},n={}){return this.httpClient.post(`_action/${this.getApiBasePath()}/refund${e}`,JSON.stringify(t),{headers:this.getBasicHeaders(n)}).then((e=>r.handleResponse(e)))}refund(e={orderId:null,amount:null}){return this.__post("",e)}cancel(e={orderId:null,refundId:null}){return this.__post("/cancel",e)}list(e={orderId:null}){return this.__post("/list",e)}total(e={orderId:null}){return this.__post("/total",e)}};const a=Shopware.Classes.ApiService;var l=class extends a{constructor(e,t,n="mollie"){super(e,t,n)}ship(e={itemId:null,versionId:null,quantity:null}){const t=this.getBasicHeaders();return this.httpClient.post(`_action/${this.getApiBasePath()}/ship`,JSON.stringify(e),{headers:t}).then((e=>a.handleResponse(e)))}total(e={orderId:null}){const t=this.getBasicHeaders();return this.httpClient.post(`_action/${this.getApiBasePath()}/ship/total`,JSON.stringify(e),{headers:t}).then((e=>a.handleResponse(e)))}};const{Application:d}=Shopware;d.addServiceProvider("MolliePaymentsConfigService",(e=>{const t=d.getContainer("init");return new s(t.httpClient,e.loginService)})),d.addServiceProvider("MolliePaymentsRefundService",(e=>{const t=d.getContainer("init");return new o(t.httpClient,e.loginService)})),d.addServiceProvider("MolliePaymentsShippingService",(e=>{const t=d.getContainer("init");return new l(t.httpClient,e.loginService)}));var u=n("TxRs"),c=n.n(u);const{Component:m}=Shopware;m.override("sw-customer-base-info",{template:c.a,computed:{preferredIdealIssuer(){return this.customer&&this.customer.customFields&&this.customer.customFields.mollie_payments&&this.customer.customFields.mollie_payments.preferred_ideal_issuer?this.customer.customFields.mollie_payments.preferred_ideal_issuer:null}}});var p=n("/Kex"),h=n.n(p);const{Component:g,Mixin:f}=Shopware;g.override("sw-order-line-items-grid",{template:h.a,mixins:[f.getByName("notification")],inject:["MolliePaymentsRefundService","MolliePaymentsShippingService"],props:{remainingAmount:{type:Number,required:!0},refundedAmount:{type:Number,required:!0},refunds:{type:Array,required:!0}},data:()=>({isLoading:!1,selectedItems:{},showRefundModal:!1,showShippingModal:!1,createCredit:!1,quantityToShip:1,refundAmount:0,shippingQuantity:0}),computed:{getLineItemColumns(){const e=this.$super("getLineItemColumns");return e.push({property:"customFields.shippedQuantity",label:this.$tc("sw-order.detailExtended.columnShipped"),allowResize:!1,align:"right",inlineEdit:!1,width:"100px"}),e},getRefundListColumns(){return[{property:"amount.value",label:this.$tc("mollie-payments.modals.refund.list.column.amount")},{property:"status",label:this.$tc("mollie-payments.modals.refund.list.column.status")},{property:"createdAt",label:this.$tc("mollie-payments.modals.refund.list.column.date"),width:"100px"}]},isMollieOrder(){return null!==this.order.customFields&&"mollie_payments"in this.order.customFields},isRefundable(){return this.remainingAmount>0}},created(){this.createdComponent()},methods:{createdComponent(){},onOpenRefundModal(){this.showRefundModal=!0},onCloseRefundModal(){this.showRefundModal=!1},onConfirmRefund(){this.MolliePaymentsRefundService.refund({orderId:this.order.id,amount:this.refundAmount}).then((e=>{e.success?(this.createNotificationSuccess({message:this.$tc("mollie-payments.modals.refund.success")}),this.showRefundModal=!1):this.createNotificationError({message:this.$tc("mollie-payments.modals.refund.error")})})).then((()=>{this.$emit("refund-success")})).catch((e=>{this.createNotificationError({message:e.message})}))},isRefundCancelable:e=>e.isPending||e.isQueued,cancelRefund(e){this.MolliePaymentsRefundService.cancel({orderId:this.order.id,refundId:e.id}).then((e=>{e.success?(this.createNotificationSuccess({message:this.$tc("mollie-payments.modals.refund.success")}),this.showRefundModal=!1):this.createNotificationError({message:this.$tc("mollie-payments.modals.refund.error")})})).then((()=>{this.$emit("refund-cancelled")})).catch((e=>{this.createNotificationError({message:e.message})}))},getStatus(e){return this.$tc("mollie-payments.modals.refund.list.status."+e)},getStatusDescription(e){return this.$tc("mollie-payments.modals.refund.list.status-description."+e)},onShipItem(e){this.showShippingModal=e.id},onCloseShippingModal(){this.showShippingModal=!1},onConfirmShipping(e){this.showShippingModal=!1,this.quantityToShip>0&&this.MolliePaymentsShippingService.ship({itemId:e.id,versionId:e.versionId,quantity:this.quantityToShip}).then(document.location.reload()),this.quantityToShip=0},isShippable(e){let t=!1;return"product"===e.type&&void 0!==e.customFields&&null!==e.customFields&&void 0!==e.customFields.mollie_payments&&null!==e.customFields.mollie_payments&&void 0!==e.customFields.mollie_payments.order_line_id&&null!==e.customFields.mollie_payments.order_line_id&&(void 0===e.customFields.shippedQuantity||parseInt(e.customFields.shippedQuantity,10)<e.quantity)&&(t=!0),t},shippableQuantity:e=>void 0!==e.customFields&&void 0!==e.customFields.shippedQuantity&&void 0!==e.customFields.refundedQuantity?e.quantity-parseInt(e.customFields.shippedQuantity,10)-parseInt(e.customFields.refundedQuantity,10):void 0!==e.customFields&&void 0===e.customFields.shippedQuantity&&void 0!==e.customFields.refundedQuantity?e.quantity-parseInt(e.customFields.refundedQuantity,10):e.quantity}});var y=n("+iPB"),b=n.n(y);const{Component:w}=Shopware;w.override("sw-order-user-card",{template:b.a,computed:{mollieOrderId(){return this.currentOrder&&this.currentOrder.customFields&&this.currentOrder.customFields.mollie_payments&&this.currentOrder.customFields.mollie_payments.order_id?this.currentOrder.customFields.mollie_payments.order_id:null}}});var v=n("iuSo"),_=n.n(v);const{Component:k,Mixin:M}=Shopware;k.override("sw-order-detail-base",{template:_.a,mixins:[M.getByName("notification")],data:()=>({remainingAmount:0,refundedAmount:0,refundAmountPending:0,refunds:[],shippedAmount:0,shippedItems:0}),inject:["MolliePaymentsRefundService","MolliePaymentsShippingService"],watch:{order(){this.getMollieData()}},methods:{getMollieData(){""!==this.order.id&&(this.MolliePaymentsRefundService.total({orderId:this.order.id}).then((e=>{this.remainingAmount=e.remaining,this.refundedAmount=e.refunded})).catch((e=>{this.createNotificationError({message:e.message})})),this.MolliePaymentsShippingService.total({orderId:this.order.id}).then((e=>{this.shippedAmount=e.amount,this.shippedItems=e.items})),this.MolliePaymentsRefundService.list({orderId:this.order.id}).then((e=>this.refunds=e)).then((e=>{this.refundAmountPending=0,e.forEach((e=>{(e.isPending||e.isQueued)&&(this.refundAmountPending+=e.amount.value)}))})).catch((e=>{this.createNotificationError({message:e.message})})))}}});var S=n("GE23"),R=n.n(S);const{Component:x,Mixin:A}=Shopware;x.register("mollie-test-api-key",{template:R.a,inject:["MolliePaymentsConfigService"],mixins:[A.getByName("notification")],methods:{onTestButtonClicked(){let e=this;const t=document.querySelector('input[name="MolliePayments.config.liveApiKey"]'),n=document.querySelector('input[name="MolliePayments.config.testApiKey"]'),i=t?t.value:null,s=n?n.value:null;this.MolliePaymentsConfigService.testApiKeys({liveApiKey:i,testApiKey:s}).then((i=>{i.results,i.results.forEach((function(i){let s={title:e.$tc("sw-payment.testApiKeys.title"),message:`${e.$tc("sw-payment.testApiKeys.apiKey")} "${i.key}" (${i.mode}) ${!0===i.valid?e.$tc("sw-payment.testApiKeys.isValid"):e.$tc("sw-payment.testApiKeys.isInvalid")}.`},r="live"===i.mode?t:n;r&&r.parentNode.parentNode.classList.remove("has--error"),!0===i.valid?e.createNotificationSuccess(s):(e.createNotificationError(s),r&&r.parentNode.parentNode.classList.add("has--error"))}))}))}}});var I=n("ExJP"),P=n("6M4d"),B=n("z4Qt");const{Module:$}=Shopware;$.register("mollie-payments",{type:"plugin",name:"MolliePayments",title:"mollie-payments.general.mainMenuItemGeneral",description:"mollie-payments.general.descriptionTextModule",version:"1.0.0",targetVersion:"1.0.0",color:"#333",icon:"default-action-settings",snippets:{"de-DE":I,"en-GB":P,"nl-NL":B}})},iuSo:function(e,t){e.exports='{% block sw_order_detail_base_line_items_grid %}\n    <sw-order-line-items-grid :order="order"\n                              :context="versionContext"\n                              :editable="isEditing"\n                              ref="sw-order-line-item-grid"\n                              :remainingAmount="remainingAmount"\n                              :refundedAmount="refundedAmount"\n                              :refunds="refunds"\n                              @refund-success="saveAndReload"\n                              @refund-cancelled="saveAndReload"\n                              @item-delete="saveAndRecalculate"\n                              @item-edit="recalculateAndReload"\n                              @existing-item-edit="saveAndRecalculate"\n                              @item-added="recalculateAndReload"\n                              @item-cancel="recalculateAndReload">\n    </sw-order-line-items-grid>\n{% endblock %}\n\n{% block sw_order_detail_base_line_items_summary_entries %}\n    {% parent %}\n    <dt v-if="refundedAmount > 0"><strong>{{ $tc(\'sw-order.detailExtended.totalRefunds\') }}</strong></dt>\n    <dd v-if="refundedAmount > 0"><strong>{{ refundedAmount | currency(order.currency.shortName) }}</strong></dd>\n\n    <dt v-if="refundAmountPending > 0"><strong>{{ $tc(\'sw-order.detailExtended.totalRefunds\') }}</strong></dt>\n    <dd v-if="refundAmountPending > 0"><strong>{{ refundAmountPending | currency(order.currency.shortName) }}</strong></dd>\n\n    <dt v-if="shippedItems > 0"><strong>{{ $tc(\'sw-order.detailExtended.totalShipments\', 0, { quantity: shippedItems }) }}</strong></dt>\n    <dd v-if="shippedItems > 0"><strong>{{ shippedAmount | currency(order.currency.shortName) }}</strong></dd>\n{% endblock %}\n\n'},z4Qt:function(e){e.exports=JSON.parse('{"mollie-payments":{"general":{"mainMenuItemGeneral":"Mollie betalingen","descriptionTextModule":"Mollie betalingen","refundThroughMollie":"Terugbetaling via Mollie","shipThroughMollie":"Verzending door Mollie"},"modals":{"refund":{"title":"Terugbetaling via Mollie","content":"Vul de hoeveelheid van dit item in ({refundableQuantity} van {quantity} over voor terugbetaling) die aan de klant moet worden terugbetaald.","success":"Er is een terugbetaling aangemaakt bij Mollie. Het kan 2 uur duren voordat de terugbetaling is voltooid. Tot deze tijd kunt u de terugbetaling annuleren in uw Mollie Dashboard.","error":"Er is iets mis gegaan bij het aanmaken van een terugbetaling.","confirmButton":"Terugbetalen","cancelButton":"Niet terugbetalen","list":{"column":{"amount":"Bedrag","status":"Status","date":"Datum"},"context":{"cancel":"Annuleer deze terugbetaling\\n"},"status":{"queued":"In wachtrij","pending":"In afwachting","processing":"In behandeling","refunded":"Terugbetaald","failed":"Mislukt"},"status-description":{"queued":"De terugbetaling wordt in de wachtrij geplaatst totdat er voldoende saldo is om de terugbetaling te verwerken. U kunt de terugbetaling nog steeds annuleren.","pending":"De terugbetaling wordt de volgende werkdag naar de bank gestuurd. U kunt de terugbetaling nog annuleren.","processing":"De terugbetaling is naar de bank gestuurd. Het bedrag wordt zo spoedig mogelijk overgemaakt op de rekening van de klant.","refunded":"Het restitutiebedrag is overgemaakt naar de klant.","failed":"De terugbetaling is mislukt na verwerking. De klant heeft bijvoorbeeld zijn/haar bankrekening opgeheven. Het geld zal worden teruggestort op de rekening."}}},"shipping":{"title":"Verzend een order line item via Mollie","content":"Vul de hoeveelheid van dit item in ({shippableQuantity} van {quantity} over voor verzending) om naar de klant te verzenden.","quantityPlaceholder":"De te verzenden hoeveelheid...","confirmButton":"Verzenden","cancelButton":"Niet verzenden"}}},"sw-order":{"detailExtended":{"columnRefunded":"Terugbetaald","columnShipped":"Verzonden","labelMollieOrderId":"Mollie Order ID","totalRefunds":"Terugbetaald bedrag","totalRemaining":"Terug te betalen","totalRemainingHelpText":"Je kunt tot € 25 boven op het totaalbedrag terugbetalen met Mollie.","totalShipments":"Verzonden bedrag ({quantity} items)"}},"sw-payment":{"testButton":"Controlle","testApiKeys":{"title":"Mollie Payments","apiKey":"API Key","isValid":"is geldig","isInvalid":"is geldig"}},"sw-customer":{"extendedInfo":{"labelPreferredIdealIssuer":"Voorkeur iDeal verstrekker"}}}')}},[["ab5s","runtime"]]]);