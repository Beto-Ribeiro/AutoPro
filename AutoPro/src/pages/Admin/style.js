import styled from 'styled-components';

const red = '#b20d18';
const slate = '#536075';
const border = '#decaca';

export const Shell = styled.div`min-height:100vh;background:#f6f7f9;color:#12151b;`;
export const Sidebar = styled.aside`
  position:fixed;inset:0 auto 0 0;width:280px;padding:30px 26px 26px;background:#f1f2f5;border-right:1px solid #e4caca;display:flex;flex-direction:column;z-index:20;
  @media(max-width:1050px){width:240px}@media(max-width:760px){width:280px;transform:translateX(${({$open})=>$open?'0':'-102%'});transition:.25s;box-shadow:12px 0 40px #0002}
`;
export const Brand = styled.div`
 display:flex;align-items:center;gap:13px;margin-bottom:28px;&>span{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:${red};color:#fff;font-weight:800;box-shadow:0 8px 22px #b20d1825}strong{display:block;font-size:22px;line-height:1.1}small{display:block;font-size:14px;color:${slate};margin-top:5px}
`;
export const PrimaryButton = styled.button`border:0;background:${red};color:#fff;min-height:48px;padding:0 20px;border-radius:10px;font-weight:720;display:flex;align-items:center;justify-content:center;gap:8px;transition:.2s;&:hover{background:#8e0710;transform:translateY(-1px)}`;
export const Nav = styled.nav`
 display:grid;gap:8px;margin-top:30px;button{border:0;background:transparent;display:flex;align-items:center;gap:14px;padding:15px 16px;border-radius:10px;color:#4d5a70;font-weight:650;text-align:left}button svg{font-size:22px}button:hover,button.active{color:${red};background:#e4e9fb}
`;
export const Settings = styled.button`margin-top:auto;border:0;border-top:1px solid #ddc4c4;background:transparent;display:flex;align-items:center;gap:14px;padding:24px 16px 15px;color:#4d5a70;font-weight:650;text-align:left;svg{font-size:22px}`;
export const CloseMenu = styled.button`display:none;@media(max-width:760px){display:block;position:absolute;top:16px;right:16px;border:0;background:transparent;font-size:22px}`;
export const MobileMenu = styled.button`display:none;@media(max-width:760px){display:grid;place-items:center;position:fixed;left:14px;top:14px;width:44px;height:44px;z-index:12;border:1px solid #ddd;border-radius:9px;background:#fff;font-size:22px}`;
export const Scrim = styled.button`display:none;@media(max-width:760px){display:block;position:fixed;inset:0;background:#0005;z-index:15;border:0}`;
export const Main = styled.main`margin-left:280px;min-height:100vh;@media(max-width:1050px){margin-left:240px}@media(max-width:760px){margin-left:0}`;
export const Topbar = styled.header`
 height:78px;background:#fff;border-bottom:1px solid #ead0d0;display:flex;align-items:center;padding:0 42px;gap:28px;&>b{color:${red};font-size:26px;font-weight:850}.profile{}@media(max-width:1050px){padding:0 24px;&>b{display:none}}@media(max-width:760px){height:72px;padding:0 16px 0 68px;gap:12px}
`;
export const GlobalSearch = styled.label`
 margin-left:auto;width:min(450px,40vw);height:46px;border:1px solid #d8c3c3;background:#fff;display:flex;align-items:center;gap:11px;padding:0 15px;border-radius:9px;color:${slate};input{border:0;outline:0;background:transparent;width:100%;color:#12151b}@media(max-width:760px){width:auto;flex:1;margin:0}
`;
export const Notification = styled.button`border:0;background:transparent;color:${slate};position:relative;font-size:21px;i{position:absolute;top:0;right:1px;width:8px;height:8px;border-radius:50%;background:${red}}`;
export const Profile = styled.div`display:flex;align-items:center;gap:10px;padding-left:24px;border-left:1px solid #e3d2d2;&>span{width:38px;height:38px;background:#1f2937;color:#fff;display:grid;place-items:center;border-radius:50%;font-size:12px;font-weight:750}small{font-size:14px}@media(max-width:760px){display:none}`;
export const Page = styled.section`padding:48px 44px 80px;max-width:1420px;margin:0 auto;@media(max-width:1050px){padding:38px 26px}@media(max-width:760px){padding:30px 16px 60px}`;
export const Heading = styled.div`
 margin-bottom:32px;display:flex;align-items:flex-end;justify-content:space-between;gap:30px;h1{margin:0;font-size:38px;letter-spacing:-1.4px;line-height:1.12}p{margin:8px 0 0;color:${slate};font-size:17px}@media(max-width:1050px){align-items:flex-start;flex-direction:column}@media(max-width:760px){h1{font-size:31px}}
`;
export const Eyebrow = styled.p`color:${red}!important;font-size:12px!important;font-weight:800!important;letter-spacing:.12em;margin:0 0 6px!important;`;
export const Date = styled.div`text-align:right;span{display:block;font-size:13px;color:${slate};margin-bottom:4px}strong{font-size:17px}@media(max-width:1050px){align-self:flex-end}@media(max-width:760px){display:none}`;
export const Stats = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:24px;&.order-stats{margin-bottom:28px}@media(max-width:1050px){gap:14px}@media(max-width:760px){grid-template-columns:1fr}`;
export const Stat = styled.article`
 position:relative;overflow:hidden;padding:28px;min-height:195px;background:#fff;border:1px solid ${border};border-radius:14px;box-shadow:0 3px 10px #20111408;&:after{content:"";position:absolute;width:100px;height:100px;border-radius:50%;background:#f6f7f9;right:-22px;top:-24px}header{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;text-transform:uppercase;color:#455066;letter-spacing:.08em;font-size:13px}header b{background:#f1f1f2;color:#323641;padding:6px 9px;font-size:11px;border-radius:6px;text-transform:none;letter-spacing:0}.icon{position:absolute;right:24px;top:70px;color:#e8eaee;font-size:50px}&>strong{display:block;font-size:46px;line-height:1;margin-top:30px;letter-spacing:-1.5px}&>p{color:${slate};margin:14px 0 0}@media(max-width:1050px){padding:22px;&>strong{font-size:38px}}
`;
export const OverviewGrid = styled.div`display:grid;grid-template-columns:2.05fr 1fr;gap:24px;margin-top:28px;@media(max-width:1050px){grid-template-columns:1fr}@media(max-width:760px){margin-top:14px}`;
export const Panel = styled.div`background:#fff;border:1px solid ${border};border-radius:14px;overflow:hidden;box-shadow:0 3px 10px #20111407;`;
export const PanelTitle = styled.div`display:flex;align-items:center;justify-content:space-between;padding:20px 22px;border-bottom:1px solid #e2cece;h2{margin:0;font-size:22px}button{color:${red};background:none;border:0;font-weight:700}`;
export const Activity = styled.div`
 min-height:85px;display:grid;grid-template-columns:44px 1fr auto;gap:14px;align-items:center;padding:14px 20px;border-bottom:1px solid #e4d3d3;&:last-child{border:0}&>span{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:#e2e8fb;color:#58657b}&>span.warning{background:#ffe1df;color:${red}}strong{font-size:16px}p{margin:4px 0 0;color:${slate}}time{font-size:12px;color:${slate};align-self:start;margin-top:5px}@media(max-width:760px){grid-template-columns:42px 1fr;time{display:none}}
`;
export const System = styled(Panel)`padding:28px;h2{margin:0 0 20px;font-size:22px}p{display:grid;grid-template-columns:10px 1fr auto;gap:10px;align-items:center;margin:16px 0}p i{width:9px;height:9px;border-radius:50%}.green{background:#20bc62}.yellow{background:#efb80c}p span{font-size:12px;color:${slate}}button{margin-top:28px;height:44px;width:100%;display:flex;align-items:center;justify-content:center;gap:9px;background:#fff;border:1px solid #a7a7a7;font-weight:700}`;
export const Actions = styled.div`display:flex;gap:12px;align-items:center;${PrimaryButton}{min-width:185px}@media(max-width:1050px){width:100%}@media(max-width:760px){align-items:stretch;flex-wrap:wrap;${PrimaryButton}{width:100%}}`;
export const SearchBox = styled.label`height:48px;width:310px;border:1px solid #d8c3c3;background:#fff;display:flex;align-items:center;gap:11px;padding:0 15px;border-radius:9px;color:${slate};input{border:0;outline:0;background:transparent;width:100%;color:#12151b}@media(max-width:1050px){width:100%}`;
export const Filter = styled.button`height:48px;width:48px;flex:0 0 48px;border:1px solid #d8d8d8;background:#fff;border-radius:9px;display:grid;place-items:center;color:#455066;font-size:19px;`;
export const DataPanel = styled(Panel)``;
export const ProductHead = styled.div`height:56px;background:#f4f5f7;padding:0 28px;display:grid;grid-template-columns:2fr 1fr .75fr .55fr .6fr;align-items:center;text-transform:uppercase;color:#455066;font-size:13px;font-weight:750;letter-spacing:.07em;border-bottom:1px solid ${border};@media(max-width:760px){display:none}`;
export const ProductRow = styled.div`
 width:100%;border-bottom:1px solid #e3d1d1;background:#fff;padding:18px 28px;display:grid;grid-template-columns:2fr 1fr .75fr .55fr .6fr;align-items:center;text-align:left;min-height:80px;transition:.15s;&:hover{background:#fffafa}.product{display:flex;align-items:center;gap:14px}.product>i{font-size:24px;font-style:normal}.product strong{font-size:15px;font-weight:600}&>span>em{display:inline-block;padding:5px 8px;border-radius:5px;background:#efeeee;color:#66595b;font-size:12px;text-transform:uppercase;font-style:normal}&>b{font-size:15px}.stock{display:flex;align-items:center;gap:8px}.stock i{width:9px;height:9px;border-radius:50%}.green{background:#20bc62}.orange{background:#ff7817}.red{background:#dd4e58}@media(max-width:760px){grid-template-columns:1fr auto;gap:14px;padding:14px;&>span:nth-child(2),&>b{display:none}}
`;
export const Pagination = styled.div`padding:14px 16px;min-height:62px;display:flex;align-items:center;justify-content:space-between;color:${slate};background:#f5f6f8;button{width:40px;height:40px;border:1px solid #dbc2c2;background:#fff;border-radius:7px;color:${slate};margin-left:8px}button:disabled{opacity:.35;cursor:not-allowed}@media(max-width:760px){font-size:12px}`;
export const Empty = styled.div`padding:50px;text-align:center;color:${slate};`;
export const OrderHead = styled.div`height:58px;display:grid;grid-template-columns:.9fr 1.8fr .8fr .8fr .7fr .9fr;align-items:center;gap:14px;padding:0 20px;color:#455066;text-transform:uppercase;font-size:12px;font-weight:750;letter-spacing:.06em;border-bottom:1px solid #ddd;@media(max-width:1050px){grid-template-columns:.9fr 1.8fr .8fr .8fr 1fr;span:nth-child(5){display:none}}@media(max-width:760px){display:none}`;
export const OrderRow = styled.div`
 min-height:80px;display:grid;grid-template-columns:.9fr 1.8fr .8fr .8fr .7fr .9fr;align-items:center;gap:14px;padding:0 20px;border-bottom:1px solid #ddd;.client{display:flex;align-items:center;gap:10px}.client>i{width:36px;height:36px;flex:0 0 36px;display:grid;place-items:center;border-radius:50%;background:#dfe5fa;color:${slate};font-style:normal;font-weight:750;font-size:13px}.client b,.client small{display:block}.client small{margin-top:3px;color:${slate};font-size:11px}time{color:${slate};font-size:13px}&>b{font-size:14px}@media(max-width:1050px){grid-template-columns:.9fr 1.8fr .8fr .8fr 1fr;&>span:nth-child(5){display:none}}@media(max-width:760px){grid-template-columns:1fr;gap:8px;padding:16px;&>strong{color:${red}}}
`;
export const ModalBackdrop = styled.div`position:fixed;inset:0;background:#15151680;z-index:50;display:grid;place-items:center;padding:20px;backdrop-filter:blur(3px);`;
export const Modal = styled.div`
 width:min(540px,100%);background:#fff;border-radius:18px;padding:32px;box-shadow:0 28px 80px #0004;position:relative;.close{position:absolute;top:20px;right:20px;background:none;border:0;color:${slate};font-size:20px}h2{font-size:28px;margin:0}&>p{color:${slate};margin-top:8px}label{display:grid;gap:7px;margin-top:18px;font-size:13px;font-weight:700;color:#455066}input,select{height:46px;border:1px solid #d8c3c3;border-radius:8px;padding:0 12px;background:#fff;color:#12151b}&>div{display:grid;grid-template-columns:1fr 1fr;gap:14px}footer{display:flex;justify-content:flex-end;gap:12px;margin-top:28px}footer>button{min-height:44px;padding:0 18px;border-radius:8px;border:1px solid #ccc;background:#fff}@media(max-width:760px){padding:26px 20px;&>div{grid-template-columns:1fr}}
`;
export const Toast = styled.div`position:fixed;right:28px;bottom:28px;z-index:100;background:#15181d;color:#fff;padding:15px 20px;border-radius:10px;box-shadow:0 12px 40px #0003;@media(max-width:760px){left:16px;right:16px;bottom:16px;text-align:center}`;
