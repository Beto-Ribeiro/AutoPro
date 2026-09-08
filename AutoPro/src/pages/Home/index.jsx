import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/card';
import Categoriacard from '../../components/categoria card';
import Banner from '../../components/banner';
import { CATEGORIES, listProducts, productError } from '../../lib/products';
import { PageWrapper, Section, SectionHeader, CategoriesGrid, ProductGrid } from './style';

const icons = ['settings', 'build', 'directions_car', 'bolt', 'shield', 'water_drop'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [params] = useSearchParams();
  const category = params.get('categoria') || '';
  const query = (params.get('q') || '').toLocaleLowerCase('pt-BR');
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError('');
      try { const items = await listProducts(); if (active) setProducts(items); }
      catch (err) { if (active) { setProducts([]); setError(productError(err)); } }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [reload]);
  const filtered = products.filter(p => (!category || p.categoria === category) &&
    `${p.titulo} ${p.categoria} ${p.marca} ${p.seller?.username}`.toLocaleLowerCase('pt-BR').includes(query));
  return <PageWrapper>
    <Banner />
    <Section id="categorias"><SectionHeader><h2>Categorias</h2></SectionHeader>
      <CategoriesGrid>{CATEGORIES.map((name, i) => <Categoriacard key={name} icon={icons[i]} titulo={name} href={`/?categoria=${encodeURIComponent(name)}#destaques`} />)}</CategoriesGrid>
    </Section>
    <Section id="destaques"><SectionHeader><h2>{category || 'Produtos à venda'}</h2><Link to="/">Ver todos</Link></SectionHeader>
      {loading && <p role="status">Carregando produtos...</p>}
      {error && <div role="alert"><p>{error}</p><button onClick={() => setReload(value => value + 1)}>Tentar novamente</button></div>}
      {!loading && !error && filtered.length === 0 && <p>{category || query ? 'Nenhum produto encontrado para esta busca.' : 'Ainda não há produtos à venda.'} <Link to="/profile#meus-produtos">Cadastre seu primeiro anúncio.</Link></p>}
      {!loading && !error && <ProductGrid>{filtered.map(product => <Card key={product.id} product={product} />)}</ProductGrid>}
    </Section>
  </PageWrapper>;
}
