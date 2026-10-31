// Elige el almacén de datos según VITE_DATA_MODE: "api" (backend real, predeterminado) o "demo" (localStorage).
import { mode } from '../services/api';
import * as Demo from './StoreDemo';
import * as Api from './StoreApi';

const impl = mode === 'demo' ? Demo : Api;
export const Store = impl.Store;
export const useStore = impl.useStore;
