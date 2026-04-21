import { render, screen, fireEvent } from '@testing-library/react';
import { MetadataForm } from '@/components/diagnosis/MetadataForm';

describe('MetadataForm', () => {
  it('renders all input fields', () => {
    render(<MetadataForm onChange={jest.fn()} />);
    expect(screen.getByLabelText(/仕込み開始日/)).toBeInTheDocument();
    expect(screen.getByLabelText(/保存温度/)).toBeInTheDocument();
    expect(screen.getByLabelText(/保存場所/)).toBeInTheDocument();
    expect(screen.getByLabelText(/大豆品種/)).toBeInTheDocument();
    expect(screen.getByLabelText(/麹歩合/)).toBeInTheDocument();
    expect(screen.getByLabelText(/塩分比/)).toBeInTheDocument();
  });

  it('calls onChange with temperature as number', () => {
    const onChange = jest.fn();
    render(<MetadataForm onChange={onChange} />);
    const tempInput = screen.getByLabelText(/保存温度/);
    fireEvent.change(tempInput, { target: { value: '25' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ temperature: 25 }));
  });

  it('calls onChange with text fields as strings', () => {
    const onChange = jest.fn();
    render(<MetadataForm onChange={onChange} />);
    const locationInput = screen.getByLabelText(/保存場所/);
    fireEvent.change(locationInput, { target: { value: '冷暗所' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ storageLocation: '冷暗所' }));
  });
});
