import styled from 'styled-components';

export const ProfileContainer = styled.div`
  background-color: #f7f9fb;
  color: #191c1e;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const TopNav = styled.nav`
  background-color: #ffffff;
  border-bottom: 1px solid #e6bdb8;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  width: 100%;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 50;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Logo = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #b70011;
  cursor: pointer;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    color: #565e74;
    font-size: 16px;
    transition: color 0.2s, transform 0.1s;
    
    &:hover {
      color: #dc2626;
    }
    &:active {
      transform: scale(0.95);
    }
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
  }

  .cart-btn {
    color: #565e74;
    transition: color 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    &:hover {
      color: #dc2626;
    }
  }

  .profile-btn {
    color: #b70011;
    font-weight: 700;
    border-bottom: 2px solid #b70011;
    padding-bottom: 4px;
  }
`;

export const MainArea = styled.main`
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 24px 40px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 767px) {
    padding: 24px 16px;
  }
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  border: 1px solid #e0e3e5;
  border-radius: 8px;
  padding: 12px;
  height: fit-content;
  
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #ffffff;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e0e3e5;
    height: fit-content;
    position: sticky;
    top: 96px;
  }
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #e0e3e5;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #b70011;
    color: white;
    font-weight: bold;
    font-size: 20px;
  }

  .info {
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #191c1e;
      margin: 0;
    }
    p {
      font-size: 14px;
      color: #565e74;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 128px;
    }
  }
`;

export const SidebarLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${props => props.$active ? '700' : '600'};
  background: ${props => props.$active ? '#dae2fd' : 'transparent'};
  color: ${props => props.$active ? '#5c647a' : '#565e74'};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, color 0.2s;
  width: 100%;

  &:hover {
    background-color: ${props => props.$active ? '#dae2fd' : '#e6e8ea'};
    color: ${props => props.$active ? '#5c647a' : '#191c1e'};
  }

  span.material-symbols-outlined {
    font-size: 24px;
  }
  
  &.logout {
    margin-top: auto;
  }
`;

export const ContentArea = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  grid-column: span 1;

  @media (min-width: 768px) {
    grid-column: span 3;
  }
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #191c1e;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

export const SectionCard = styled.section`
  scroll-margin-top: 88px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(15,23,42,0.08);
  padding: 24px;
  border: 1px solid #e0e3e5;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .danger-zone { border-top: 1px solid #e0e3e5; margin-top: 12px; padding-top: 20px; }
  .danger-zone h3 { margin: 0; color: #8d000d; font-size: 17px; }
  .danger-zone p { max-width: 680px; color: #565e74; }
  .delete-account { background: white; color: #b70011; border: 1px solid #b70011; border-radius: 6px; padding: 10px 16px; font: inherit; cursor: pointer; }
  .delete-account:disabled { opacity: .6; cursor: wait; }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e3e5;
  padding-bottom: 4px;
  margin-bottom: 4px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #191c1e;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    
    span {
      color: #565e74;
    }
  }

  .edit-btn {
    color: #b70011;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background-color: #dc2626;
      color: #fff6f5;
    }
  }

  .add-btn {
    background-color: #b70011;
    color: #ffffff;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background 0.2s;

    &:hover {
      background-color: #dc2626;
      color: #fff6f5;
    }
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const InputGroup = styled.div`
  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #565e74;
    margin-bottom: 4px;
  }

  input {
    width: 100%;
    background-color: #f2f4f6;
    border: 1px solid #e0e3e5;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 16px;
    color: #191c1e;
    outline: none;

    &:focus {
      border-color: #191c1e;
      box-shadow: 0 0 0 1px #191c1e;
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.8;
    }
  }
`;

export const SecurityForm = styled.form`
  display: grid;
  gap: 16px;
  max-width: 440px;

  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 16px; }
  button { width: fit-content; background: #b70011; color: white; border: 1px solid #b70011; border-radius: 6px; padding: 10px 16px; font: inherit; cursor: pointer; }
  button:disabled { opacity: .6; cursor: wait; }
`;

export const EmptyState = styled.div`
  grid-column: span 1;
  color: #565e74;
  padding: 16px;
  background-color: #f2f4f6;
  border-radius: 6px;
  text-align: center;

  @media (min-width: 768px) {
    grid-column: span 2;
  }
`;

export const AddressBox = styled.div`
  border: 1px solid #e0e3e5;
  border-radius: 6px;
  padding: 12px;
  position: relative;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .actions {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 4px;

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: #565e74;
      transition: color 0.2s;

      &:hover {
        color: #b70011;
      }
      &.delete:hover {
        color: #ba1a1a;
      }
    }
  }

  .badge {
    background-color: #e0e3e5;
    color: #565e74;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
    display: inline-block;
  }

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #191c1e;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: #565e74;
    margin: 0;
    line-height: 1.5;
  }
`;

export const Footer = styled.footer`
  background-color: #e0e3e5;
  border-top: 1px solid #e6bdb8;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 24px 40px;
  width: 100%;
  margin-top: auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 767px) {
    padding: 24px 16px;
  }
`;

export const FooterBrand = styled.div`
  grid-column: span 1;

  span {
    font-size: 20px;
    font-weight: 700;
    color: #191c1e;
    display: block;
    margin-bottom: 4px;
  }

  p {
    font-size: 14px;
    color: #565e74;
    margin: 0;
  }
`;

export const FooterLinks = styled.div`
  grid-column: span 1;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;

  @media (min-width: 768px) {
    grid-column: span 3;
    justify-content: flex-end;
  }

  a {
    font-size: 14px;
    color: #565e74;
    opacity: 0.8;
    transition: opacity 0.2s, color 0.2s;

    &:hover {
      opacity: 1;
      color: #191c1e;
    }
  }
`;
