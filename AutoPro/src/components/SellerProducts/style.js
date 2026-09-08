import styled from 'styled-components';

export const Form = styled.form`
  display: grid; gap: 16px;
  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 16px; min-width: 0; }
  .fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  label { display: grid; gap: 6px; font-size: 14px; font-weight: 600; }
  input, textarea, select { width: 100%; min-width: 0; padding: 12px; border: 1px solid #c7cbd1; border-radius: 6px; font: inherit; background: white; color: #191c1e; }
  textarea { min-height: 120px; resize: vertical; }
  .checkbox { display: flex; align-items: center; }
  .checkbox input { width: auto; }
  .actions { display: flex; gap: 12px; flex-wrap: wrap; }
  button { padding: 12px 18px; border: 1px solid #b70011; border-radius: 6px; background: #b70011; color: white; cursor: pointer; font: inherit; }
  button[type=button] { background: white; color: #b70011; }
  button:disabled { opacity: .6; cursor: wait; }
  @media(max-width: 600px) { .fields { grid-template-columns: 1fr; } }
`;
export const Listings = styled.div`
  display: grid; gap: 12px;
  article { display: flex; align-items: center; gap: 16px; border-top: 1px solid #e0e3e5; padding-top: 16px; }
  .photo { width: 80px; height: 80px; flex-shrink: 0; background: #f2f4f6; }
  img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
  .info { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  p { margin: 6px 0; }
  button { background: white; color: #b70011; border: 1px solid #b70011; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
  @media(max-width: 500px) { article { flex-wrap: wrap; } }
`;
