import React from 'react';
import { render, screen } from '@testing-library/react';
import PrioritySection from './PrioritySection';

// Mock the lucide-react Target component
jest.mock('lucide-react', () => ({
  Target: () => <div data-testid="target-icon" />
}));

describe('PrioritySection', () => {
  const mockConfig = {
    label: 'Test Priority Section',
    description: 'Test Description',
    style: {
      border: 'border-blue-500',
      background: 'bg-blue-50',
      iconColor: 'text-blue-900'
    }
  };

  const mockAreas = [
    { id: 1, title: 'Area 1' },
    { id: 2, title: 'Area 2' }
  ];

  it('should render nothing when areas array is empty', () => {
    const { container } = render(
      <PrioritySection areas={[]} config={mockConfig}>
        <div>Test Content</div>
      </PrioritySection>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when areas is undefined', () => {
    const { container } = render(
      <PrioritySection config={mockConfig}>
        <div>Test Content</div>
      </PrioritySection>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render the section with correct content when areas exist', () => {
    render(
      <PrioritySection areas={mockAreas} config={mockConfig}>
        <div data-testid="test-content">Test Content</div>
      </PrioritySection>
    );

    expect(screen.getByText('Test Priority Section')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('target-icon')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    render(
      <PrioritySection areas={mockAreas} config={mockConfig}>
        <div>Test Content</div>
      </PrioritySection>
    );

    const container = screen.getByText('Test Priority Section').closest('.rounded-lg');
    expect(container).toHaveClass('bg-blue-50');
    expect(container).toHaveClass('border-gray-200');
  });

  it('should render children content', () => {
    render(
      <PrioritySection areas={mockAreas} config={mockConfig}>
        <div data-testid="child-content">Child Content</div>
      </PrioritySection>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
}); 