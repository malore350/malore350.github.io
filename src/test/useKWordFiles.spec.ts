import { describe, it, expect, beforeEach } from 'vitest'
import {
  getKWordFiles,
  getActiveKWordFiles,
  getTrashedKWordFiles,
  saveKWordFile,
  deleteKWordFile,
  restoreKWordFile,
  permanentlyDeleteKWordFile,
  emptyTrash,
  renameKWordFile,
  type KWordFile,
} from '../hooks/useKWordFiles'

const STORAGE_KEY = 'kword_files'

function createMockFile(overrides: Partial<KWordFile> = {}): KWordFile {
  return {
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: 'test.kword',
    content: '<h1>Test</h1>',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

function seedLocalStorage(files: KWordFile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
}

describe('useKWordFiles – soft-delete functions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // ─── a. getActiveKWordFiles ───────────────────────────────────
  describe('getActiveKWordFiles', () => {
    it('returns only files without deletedAt', () => {
      const active = createMockFile({ id: 'a1', name: 'active.kword' })
      const trashed = createMockFile({ id: 'a2', name: 'trashed.kword', deletedAt: Date.now() })
      seedLocalStorage([active, trashed])

      const result = getActiveKWordFiles()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('a1')
      expect(result[0].deletedAt).toBeUndefined()
    })

    it('returns empty array when all files are trashed', () => {
      seedLocalStorage([
        createMockFile({ id: 'a3', deletedAt: Date.now() }),
        createMockFile({ id: 'a4', deletedAt: Date.now() }),
      ])

      expect(getActiveKWordFiles()).toHaveLength(0)
    })

    it('returns empty array when storage is empty', () => {
      expect(getActiveKWordFiles()).toHaveLength(0)
    })
  })

  // ─── b. getTrashedKWordFiles ──────────────────────────────────
  describe('getTrashedKWordFiles', () => {
    it('returns only files with deletedAt', () => {
      const active = createMockFile({ id: 'b1' })
      const trashed = createMockFile({ id: 'b2', deletedAt: Date.now() })
      seedLocalStorage([active, trashed])

      const result = getTrashedKWordFiles()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('b2')
      expect(result[0].deletedAt).toBeDefined()
    })

    it('returns empty array when no files are trashed', () => {
      seedLocalStorage([
        createMockFile({ id: 'b3' }),
        createMockFile({ id: 'b4' }),
      ])

      expect(getTrashedKWordFiles()).toHaveLength(0)
    })
  })

  // ─── c. deleteKWordFile (soft-delete) ─────────────────────────
  describe('deleteKWordFile', () => {
    it('sets deletedAt timestamp on the file (soft-delete)', () => {
      const file = createMockFile({ id: 'c1' })
      seedLocalStorage([file])

      deleteKWordFile('c1')

      const files = getKWordFiles()
      expect(files).toHaveLength(1)
      expect(files[0].deletedAt).toBeDefined()
      expect(typeof files[0].deletedAt).toBe('number')
    })

    it('does nothing when file id does not exist', () => {
      seedLocalStorage([createMockFile({ id: 'c2' })])
      deleteKWordFile('nonexistent')

      const files = getKWordFiles()
      expect(files).toHaveLength(1)
      expect(files[0].deletedAt).toBeUndefined()
    })

    it('does not affect other files when deleting one', () => {
      seedLocalStorage([
        createMockFile({ id: 'c3' }),
        createMockFile({ id: 'c4' }),
      ])

      deleteKWordFile('c3')

      const files = getKWordFiles()
      expect(files).toHaveLength(2)
      expect(files.find((f) => f.id === 'c3')!.deletedAt).toBeDefined()
      expect(files.find((f) => f.id === 'c4')!.deletedAt).toBeUndefined()
    })
  })

  // ─── d. restoreKWordFile ──────────────────────────────────────
  describe('restoreKWordFile', () => {
    it('clears deletedAt and bumps updatedAt', () => {
      const createdAt = Date.now() - 10_000
      const file = createMockFile({ id: 'd1', deletedAt: Date.now(), createdAt, updatedAt: Date.now() })
      seedLocalStorage([file])

      restoreKWordFile('d1')

      const files = getKWordFiles()
      expect(files).toHaveLength(1)
      expect(files[0].deletedAt).toBeUndefined()
      expect(files[0].updatedAt).toBeGreaterThanOrEqual(file.updatedAt)
    })

    it('does nothing when file id does not exist', () => {
      const file = createMockFile({ id: 'd2', deletedAt: Date.now() })
      seedLocalStorage([file])

      restoreKWordFile('nonexistent')

      const files = getKWordFiles()
      expect(files[0].deletedAt).toBeDefined()
    })
  })

  // ─── e. permanentlyDeleteKWordFile ────────────────────────────
  describe('permanentlyDeleteKWordFile', () => {
    it('removes the file from storage entirely', () => {
      seedLocalStorage([
        createMockFile({ id: 'e1' }),
        createMockFile({ id: 'e2' }),
      ])

      permanentlyDeleteKWordFile('e1')

      const files = getKWordFiles()
      expect(files).toHaveLength(1)
      expect(files[0].id).toBe('e2')
    })

    it('does nothing when file id does not exist', () => {
      seedLocalStorage([createMockFile({ id: 'e3' })])

      permanentlyDeleteKWordFile('nonexistent')

      expect(getKWordFiles()).toHaveLength(1)
    })
  })

  // ─── f. emptyTrash ────────────────────────────────────────────
  describe('emptyTrash', () => {
    it('removes all files that have deletedAt set', () => {
      seedLocalStorage([
        createMockFile({ id: 'f1' }),
        createMockFile({ id: 'f2', deletedAt: Date.now() }),
        createMockFile({ id: 'f3', deletedAt: Date.now() }),
      ])

      emptyTrash()

      const files = getKWordFiles()
      expect(files).toHaveLength(1)
      expect(files[0].id).toBe('f1')
      expect(files[0].deletedAt).toBeUndefined()
    })

    it('does nothing when trash is already empty', () => {
      seedLocalStorage([
        createMockFile({ id: 'f4' }),
        createMockFile({ id: 'f5' }),
      ])

      emptyTrash()

      expect(getKWordFiles()).toHaveLength(2)
    })
  })

  // ─── g. saveKWordFile with trashed files ──────────────────────
  describe('saveKWordFile with trashed files', () => {
    it('can update the content of a trashed file without clearing deletedAt', () => {
      const file = createMockFile({ id: 'g1', content: 'old', deletedAt: Date.now() })
      seedLocalStorage([file])

      saveKWordFile({ ...file, content: 'updated content' })

      const files = getKWordFiles()
      expect(files).toHaveLength(1)
      expect(files[0].content).toBe('updated content')
      expect(files[0].deletedAt).toBeDefined()
    })
  })

  // ─── h. renameKWordFile with trashed files ────────────────────
  describe('renameKWordFile with trashed files', () => {
    it('renames a trashed file without clearing deletedAt', () => {
      const file = createMockFile({ id: 'h1', name: 'old.kword', deletedAt: Date.now() })
      seedLocalStorage([file])

      renameKWordFile('h1', 'new-name')

      const files = getKWordFiles()
      expect(files).toHaveLength(1)
      expect(files[0].name).toBe('new-name.kword')
      expect(files[0].deletedAt).toBeDefined()
    })

    it('does nothing when file id does not exist', () => {
      seedLocalStorage([createMockFile({ id: 'h2', name: 'old.kword' })])

      renameKWordFile('nonexistent', 'new-name')

      expect(getKWordFiles()[0].name).toBe('old.kword')
    })
  })
})
