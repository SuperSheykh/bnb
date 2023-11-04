import { create } from 'zustand'

interface SearchStoreType {
   isOpen: boolean
   onOpen: () => void
   onClose: () => void
}

const useSearchModal = create<SearchStoreType>((set) => ({
   isOpen: false,
   onOpen: () => set({ isOpen: true }),
   onClose: () => set({ isOpen: false }),
}))

export default useSearchModal
