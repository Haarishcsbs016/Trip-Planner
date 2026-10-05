import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Auth Store ───
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('tripplanner_token', token);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('tripplanner_token');
        localStorage.removeItem('tripplanner_user');
        localStorage.removeItem('tripplanner_auth');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'tripplanner_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// ─── Trip Creation Store (multi-step form state) ───
export const useTripStore = create((set, get) => ({
  // Multi-step form state
  currentStep: 1,
  totalSteps: 7,

  tripForm: {
    destination: '',
    startLocation: '',
    startDate: '',
    endDate: '',
    travelers: { adults: 2, children: 0 },
    budget: 15000,
    preferences: {
      travelStyle: [],
      interests: [],
      transport: [],
      accommodation: 'mid-range',
    },
  },

  // Current generated trip
  currentTrip: null,
  isGenerating: false,
  generationStep: 0,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  resetStep: () => set({ currentStep: 1 }),

  updateTripForm: (updates) =>
    set((state) => ({
      tripForm: { ...state.tripForm, ...updates },
    })),

  updatePreferences: (updates) =>
    set((state) => ({
      tripForm: {
        ...state.tripForm,
        preferences: { ...state.tripForm.preferences, ...updates },
      },
    })),

  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setGenerating: (val) => set({ isGenerating: val }),
  setGenerationStep: (step) => set({ generationStep: step }),

  resetForm: () =>
    set({
      currentStep: 1,
      tripForm: {
        destination: '',
        startLocation: '',
        startDate: '',
        endDate: '',
        travelers: { adults: 2, children: 0 },
        budget: 15000,
        preferences: {
          travelStyle: [],
          interests: [],
          transport: [],
          accommodation: 'mid-range',
        },
      },
    }),
}));
