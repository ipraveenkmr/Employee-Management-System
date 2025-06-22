import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DataStoreState {
    empDetails: unknown[]
    authToken: string
    userEmail: string
    userName: string
    actionType: string

    updateActionType: (actionType: string) => void
    updateUserEmail: (userEmail: string) => void
    updateUserName: (userName: string) => void
    updateAuthToken: (authToken: string) => void
    updateEmpDetails: <T>(empDetails: T[]) => void
}

const useDataStore = create<DataStoreState>()(
    persist(
        (set) => ({
            empDetails: [],
            authToken: '',
            userEmail: '',
            userName: '',
            actionType: '',

            updateActionType: (actionType) => set({ actionType }),
            updateUserName: (userName) => set({ userName }),
            updateUserEmail: (userEmail) => set({ userEmail }),
            updateAuthToken: (authToken) => set({ authToken }),
            updateEmpDetails: <T>(empDetails: T[]) => set({ empDetails }),


            // Example with get (optional logic)
            // updateEmpDetails: (newDetails) => {
            //   const currentDetails = get().empDetails
            //   if (JSON.stringify(currentDetails) !== JSON.stringify(newDetails)) {
            //     set({ empDetails: newDetails })
            //   }
            // },

        }),
        {
            name: 'emp-local-storage'

        }
        // storage: createJSONStorage(() => sessionStorage), // Uncomment if you want session storage
    )

)

export default useDataStore