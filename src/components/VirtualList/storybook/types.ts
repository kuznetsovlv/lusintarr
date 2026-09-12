export interface Planet {
  id: number;
  name: string;
  mass: number;
  radius: number;
  distance: number;
  satellites: string[];
}

export interface DemoProps {
  title: string;
  useMarkerSpaceSize: boolean;
}

export type Layout = 'inline' | 'block';
