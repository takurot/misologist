import { render, screen, fireEvent } from '@testing-library/react';
import { MetadataForm } from '@/components/diagnosis/MetadataForm';

describe('MetadataForm', () => {
  it('renders all input fields', () => {
    render(<MetadataForm onChange={jest.fn()} />);
    expect(screen.getByLabelText(/Batch start date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Storage temperature/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Storage location/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Soybean variety/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Koji ratio/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salt ratio/)).toBeInTheDocument();
  });

  it('calls onChange with temperature as number', () => {
    const onChange = jest.fn();
    render(<MetadataForm onChange={onChange} />);
    const tempInput = screen.getByLabelText(/Storage temperature/);
    fireEvent.change(tempInput, { target: { value: '25' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ temperature: 25 }));
  });

  it('calls onChange with text fields as strings', () => {
    const onChange = jest.fn();
    render(<MetadataForm onChange={onChange} />);
    const locationInput = screen.getByLabelText(/Storage location/);
    fireEvent.change(locationInput, { target: { value: '冷暗所' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ storageLocation: '冷暗所' }));
  });
});
