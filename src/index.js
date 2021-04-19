import MdiIconPicker from "./MdiIconPicker.vue";

export default MdiIconPicker;

MdiIconPicker.install = function(Vue) {
  Vue.component(MdiIconPicker.name, MdiIconPicker);
};

if(typeof window !== "undefined" && window.Vue) {
  window.Vue.component(MdiIconPicker.name, MdiIconPicker);
}