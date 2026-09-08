import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Card from '../../components/card';
import Categoriacard from '../../components/categoria card';
import Banner from '../../components/banner';
import { CATEGORIES, listProducts, productError } from '../../lib/products';
import { searchProducts } from '../../lib/productSearch';
import { useCart } from '../../context/CartContext';
import { PageWrapper, Section, SectionHeader, CategoriesGrid, ProductGrid } from './style';

const icons = ['settings', 'build', 'directions_car', 'bolt', 'shield', 'water_drop'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [params] = useSearchParams();
  const { session } = useCart();
  const location = useLocation();
  const category = params.get('categoria') || '';
  const query = (params.get('q') || '').trim();
  useEffect(() => {
    if (location.hash === '#destaques') document.getElementById('destaques')?.scrollIntoView({ behavior: 'smooth' });
  }, [location.key, location.hash]);
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError('');
      try { const items = await listProducts(null, session?.user?.id); if (active) setProducts(items); }
      catch (err) { if (active) { setProducts([]); setError(productError(err)); } }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [reload, session?.user?.id]);
  const filtered = searchProducts(products, query, category);
  return <PageWrapper>
    <Banner />
    <Section id="categorias"><SectionHeader><h2>Categorias</h2></SectionHeader>
      <CategoriesGrid>{CATEGORIES.map((name, i) => <Categoriacard key={name} icon={icons[i]} titulo={name} href={`/?categoria=${encodeURIComponent(name)}#destaques`} />)}</CategoriesGrid>
    </Section>
    <Section id="destaques" style={{ scrollMarginTop: 140 }}><SectionHeader><h2>{query ? `Resultados para “${query}”` : category || 'Produtos à venda'}</h2><Link to="/">{query || category ? 'Limpar filtros' : 'Ver todos'}</Link></SectionHeader>
      {!loading && !error && (query || category) && <p role="status">{filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}{category ? ` em ${category}` : ''}.</p>}
      {loading && <p role="status">Carregando produtos...</p>}
      {error && <div role="alert"><p>{error}</p><button onClick={() => setReload(value => value + 1)}>Tentar novamente</button></div>}
      {!loading && !error && filtered.length === 0 && <p>{category || query ? 'Nenhum produto encontrado. Tente outro nome, marca ou compatibilidade, ou limpe os filtros.' : <>Ainda não há produtos à venda. <Link to="/profile/products">Cadastre seu primeiro anúncio.</Link></>}</p>}
      {!loading && !error && <ProductGrid>{filtered.map(product => <Card key={product.id} product={product} />)}</ProductGrid>}
    </Section>
  </PageWrapper>;
}
