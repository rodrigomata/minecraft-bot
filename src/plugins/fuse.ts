import Fuse from 'fuse.js'

export const createFuse = (locations: Array<{ ref: object; data: { description: string; x: number; z: number } }>) => {
  return new Fuse(locations, {
    keys: ['data.description'],
    includeScore: true,
    threshold: 0.3,
  })
}
