import PyroIcon from '../assets/elements/Pyro.svg'
import HydroIcon from '../assets/elements/Hydro.svg'
import ElectroIcon from '../assets/elements/Electro.svg'
import CryoIcon from '../assets/elements/Cryo.svg'
import AnemoIcon from '../assets/elements/Anemo.svg'
import DendroIcon from '../assets/elements/Dendro.svg'
import GeoIcon from '../assets/elements/Geo.svg'
import AbyssIcon from '../assets/elements/Abyss.svg'

export const ELEMENTS = [
  { id: 'pyro', name: 'Pyro', color: '#EF4444', icon: PyroIcon },
  { id: 'hydro', name: 'Hydro', color: '#3B82F6', icon: HydroIcon },
  { id: 'electro', name: 'Electro', color: '#A855F7', icon: ElectroIcon },
  { id: 'cryo', name: 'Cryo', color: '#67E8F9', icon: CryoIcon },
  { id: 'anemo', name: 'Anemo', color: '#6EE7B7', icon: AnemoIcon },
  { id: 'dendro', name: 'Dendro', color: '#22C55E', icon: DendroIcon },
  { id: 'geo', name: 'Geo', color: '#F59E0B', icon: GeoIcon },
  { id: 'abyss', name: 'Бездна', color: '#7C3AED', icon: AbyssIcon },
]

export const ELEMENT_MAP = Object.fromEntries(ELEMENTS.map(e => [e.id, e]))

export const ABYSS_ID = 'abyss'
