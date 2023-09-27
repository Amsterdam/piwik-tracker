import { createContext } from 'react';
import { PiwikInstance } from './types';

const PiwikContext = createContext<PiwikInstance | null>(null);

export default PiwikContext;
