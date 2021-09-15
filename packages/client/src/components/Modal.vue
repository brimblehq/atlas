<script>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";

export default {
  name: "Modal",
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  },
  props:['response', 'isOpen', 'setIsOpen'],
  methods: {
  },
};
</script>

<template>
  <TransitionRoot
    appear as="template"
    :show="isOpen"
  >
    <Dialog as="div"  @close="setIsOpen">
      <DialogOverlay/>

      <DialogTitle class="visuallyHidden">Status message</DialogTitle>
      <DialogDescription class="visuallyHidden">
        {{ response.status }}
      </DialogDescription>
      <div class="modal">
      <TransitionChild
        enter="duration-200 ease-out"
        enter-from="opacity-0 scale-0"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="sopacity-100 scale-100"
        leave-to="opacity-0 scale-0"
      >
      <div class="modal-tick">
        <svg
          width="60"
          height="38"
          viewBox="0 0 60 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            class="h-0 rect-1"
            width="4.83068"
            rx="2.41534"
            transform="matrix(-0.855371 0.518015 -0.495837 -0.868415 16.1709 35.8726)"
            fill="white"
          />
          <rect
            class="h-0 rect-2"
            width="4.72217"
            rx="2.36109"
            transform="matrix(0.569354 0.822092 -0.806982 0.590575 57.4912 0)"
            fill="white"
          />
        </svg>
      </div>
      <h4 class="modal-status">
        Completed!
        <div class="modal-status-line modal-status-line-1"></div>
        <div class="modal-status-line modal-status-line-2"></div>
      </h4>
      <p
        v-if="(response.status = 'Yay, we did it!!')"
        class="modal-message mb-1 xl:mb-3"
      >
        You are now number
        <span class="modal-number">{{ response.data.number }}</span> on the
        waiting list
      </p>      
        <p class="modal-message">We will keep you updated</p>
      
      
      <button
        class="modal-cancel"
        aria-label="Click button to close modal"
        @click="setIsOpen(false)"
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.0016 19.0001L27.303 27.3016M10.7002 27.3016L19.0016 19.0001L10.7002 27.3016ZM27.303 10.6987L19 19.0001L27.303 10.6987ZM19 19.0001L10.7002 10.6987L19 19.0001Z"
            stroke="#BDBDBD"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style>
/* Modal Animations */
.modal {
  /* animate in for modal(To make up for transition root enter animation not working :( ) */
  animation: modalAnim 0.3s ease-in-out forwards;
}
.modal-status-line {
  animation: lineAnim 0.5s ease-in-out forwards;
}
.modal-status-line-1 {
  animation-delay: 0.4s;
}
.modal-status-line-2 {
  animation-delay: 0.6s;
}
.rect-1 {
  animation: rect1Anim 0.5s 0.4s ease-in-out forwards;
}
.rect-2 {
  animation: rect2Anim 0.5s 0.4s ease-in-out forwards;
}
@keyframes modalAnim {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
@keyframes lineAnim {
  to {
    width: 125px;
  }
}
@keyframes rect1Anim {
  to {
    height: 24.2795px;
  }
}
@keyframes rect2Anim {
  to {
    height: 58.0323px;
  }
}
@keyframes lineAnimSM {
  to {
    width: 45px;
  }
}
@keyframes lineAnimXL {
  to {
    width: 95px;
  }
}
@media screen and (max-width: 640px) {
.modal-status-line {
  animation: lineAnimSM 0.5s ease-in-out forwards;
}
}
@media screen and (max-width: 1535px) {
.modal-status-line {
  animation: lineAnimXL 0.5s ease-in-out forwards;
}
}
</style>
