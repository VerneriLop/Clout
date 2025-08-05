import {useState} from 'react';

import Modal from '@mui/material/Modal';

export type CreatePostPayload = {
  image_url?: string;
  thumbnail_url?: string;
  caption?: string;
  is_visible?: boolean;
};

export default function EntryModal({
  showAddForm,
  setShowAddForm,
  onSubmit,
}: {
  showAddForm: boolean;
  setShowAddForm: (val: boolean) => void;
  onSubmit: (data: CreatePostPayload) => void;
}) {
  const [formData, setFormData] = useState<CreatePostPayload>({
    image_url: '',
    thumbnail_url: '',
    caption: '',
    is_visible: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value, type} = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setShowAddForm(false);
  };

  return (
    <Modal
      open={showAddForm}
      onClose={() => setShowAddForm(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={handleFormSubmit}
          className="bg-neutral-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
          <h2 className="text-lg font-semibold">Create Post</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="image_url" className="text-sm text-neutral-300">
              Image URL
            </label>
            <input
              name="image_url"
              type="text"
              value={formData.image_url}
              onChange={handleChange}
              className="bg-neutral-800 border border-neutral-600 text-sm p-2 rounded text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="thumbnail_url" className="text-sm text-neutral-300">
              Thumbnail URL
            </label>
            <input
              name="thumbnail_url"
              type="text"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="bg-neutral-800 border border-neutral-600 text-sm p-2 rounded text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="caption" className="text-sm text-neutral-300">
              Caption
            </label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              rows={3}
              className="bg-neutral-800 border border-neutral-600 text-sm p-2 rounded text-white resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              name="is_visible"
              type="checkbox"
              checked={formData.is_visible}
              onChange={handleChange}
              className="accent-blue-700"
            />
            <label htmlFor="is_visible" className="text-sm text-neutral-300">
              Visible to public
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-sm text-white bg-neutral-700 hover:bg-neutral-600 rounded">
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-blue-700 hover:bg-blue-800 rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
