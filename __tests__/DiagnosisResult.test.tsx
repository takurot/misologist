import { render, screen } from '@testing-library/react';
import { DiagnosisResult } from '@/components/diagnosis/DiagnosisResult';
import type { DiagnosisResult as DiagnosisResultType } from '@/types';

const base: DiagnosisResultType = {
  urgencyLevel: 'GREEN',
  moldType: '産膜酵母（白カビ）',
  moldReason: '表面に産膜酵母が発生しました',
  fermentationChemistry: 'アミノ酸分解が進行中です',
  immediateActions: ['表面のカビを取り除く', '重石を載せる'],
  preventionTips: ['塩分濃度を上げる'],
};

describe('DiagnosisResult', () => {
  it('renders urgency level GREEN with correct label', () => {
    render(<DiagnosisResult result={base} />);
    expect(screen.getByText(/GREEN/)).toBeInTheDocument();
    expect(screen.getByText(/正常/)).toBeInTheDocument();
  });

  it('renders urgency level YELLOW with correct label', () => {
    render(<DiagnosisResult result={{ ...base, urgencyLevel: 'YELLOW' }} />);
    expect(screen.getByText(/YELLOW/)).toBeInTheDocument();
    expect(screen.getByText(/注意/)).toBeInTheDocument();
  });

  it('renders urgency level RED with correct label', () => {
    render(<DiagnosisResult result={{ ...base, urgencyLevel: 'RED' }} />);
    expect(screen.getByText(/RED/)).toBeInTheDocument();
    expect(screen.getByText(/緊急/)).toBeInTheDocument();
  });

  it('displays mold type and reason', () => {
    render(<DiagnosisResult result={base} />);
    expect(screen.getByText('産膜酵母（白カビ）')).toBeInTheDocument();
    expect(screen.getByText('表面に産膜酵母が発生しました')).toBeInTheDocument();
  });

  it('renders all immediate actions', () => {
    render(<DiagnosisResult result={base} />);
    expect(screen.getByText('表面のカビを取り除く')).toBeInTheDocument();
    expect(screen.getByText('重石を載せる')).toBeInTheDocument();
  });

  it('renders prevention tips', () => {
    render(<DiagnosisResult result={base} />);
    expect(screen.getByText('塩分濃度を上げる')).toBeInTheDocument();
  });

  it('does not render batch comparison section when absent', () => {
    render(<DiagnosisResult result={base} />);
    expect(screen.queryByText(/過去バッチ/)).not.toBeInTheDocument();
  });

  it('renders batch comparison when present', () => {
    render(
      <DiagnosisResult
        result={{ ...base, batchComparison: '前回より2週間早いカビ発生' }}
      />
    );
    expect(screen.getByText('前回より2週間早いカビ発生')).toBeInTheDocument();
  });
});
