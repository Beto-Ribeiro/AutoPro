import styled from "styled-components";

export const StepsContainer = styled.div`
  width: 100%;
  max-width: 48rem; /* max-w-3xl */
  margin: 0 auto;
  margin-bottom: 2.5rem; /* mb-10 */
`;

export const TrackWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

export const TrackLine = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 2px;
  background-color: var(--surface-variant);
  z-index: 0;
`;

export const ProgressLine = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  background-color: var(--on-surface);
  z-index: 0;
  transition: all 0.3s ease;
  width: ${({ $progress }) => $progress}%;
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
  gap: 8px;
`;

export const StepIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ $status }) => 
    $status === 'completed' ? 'var(--on-surface)' : 
    $status === 'active' ? 'var(--primary)' : 'var(--surface-variant)'};
  background-color: ${({ $status }) => 
    $status === 'completed' ? 'var(--on-surface)' : 
    $status === 'active' ? 'var(--primary)' : 'var(--surface-container-lowest)'};
  color: ${({ $status }) => 
    ($status === 'completed' || $status === 'active') ? 'var(--on-primary)' : 'var(--secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: colors 0.3s;
`;

export const StepLabel = styled.span`
  font-size: 12px;
  font-weight: ${({ $status }) => $status === 'active' ? '700' : '500'};
  color: ${({ $status }) => 
    $status === 'completed' ? 'var(--on-surface)' : 
    $status === 'active' ? 'var(--primary)' : 'var(--secondary)'};
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;
