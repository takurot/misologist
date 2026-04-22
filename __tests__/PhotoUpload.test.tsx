import { render, screen } from '@testing-library/react';
import { PhotoUpload } from '@/components/diagnosis/PhotoUpload';

describe('PhotoUpload', () => {
  it('renders upload prompt text by default', () => {
    render(<PhotoUpload onImageSelect={jest.fn()} />);
    expect(screen.getByText(/Drag and drop a photo/)).toBeInTheDocument();
  });

  it('renders format hint', () => {
    render(<PhotoUpload onImageSelect={jest.fn()} />);
    expect(screen.getByText(/JPEG/)).toBeInTheDocument();
  });

  it('renders file input for accessibility', () => {
    render(<PhotoUpload onImageSelect={jest.fn()} />);
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('does not show change button before image is selected', () => {
    render(<PhotoUpload onImageSelect={jest.fn()} />);
    expect(screen.queryByText(/Change photo/)).not.toBeInTheDocument();
  });
});
