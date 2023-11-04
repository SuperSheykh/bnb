import { create } from 'zustand'

// STATE MANAGEMENT TOOL BASED ON USING HOOKS

interface RegisterModalStore {
   isOpen: boolean
   onOpen: () => void
   onClose: () => void
}

const useRegisterModal = create<RegisterModalStore>((set) => ({
   isOpen: false,
   onOpen: () => set({ isOpen: true }),
   onClose: () => set({ isOpen: false }),
}))

export default useRegisterModal
