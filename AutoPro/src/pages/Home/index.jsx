import React, { useEffect, useState } from "react";
import Card from "../../components/card";
import Categoriacard from "../../components/categoria card";
import Banner from "../../components/banner";
import { supabase } from "../../lib/supabaseClient";
import { PageWrapper, Section, SectionHeader, CategoriesGrid, ProductGrid } from "./style";

const CATEGORIES = [
  { icon: "settings",       titulo: "Transmissão" },
  { icon: "build",           titulo: "Motor"       },
  { icon: "directions_car",  titulo: "Suspensão"   },
  { icon: "bolt",            titulo: "Acessórios"  },
  { icon: "shield",          titulo: "Freios"      },
];

// Skeleton placeholder while loading
const ProductSkeleton = () => (
  <div
    style={{
      background: "var(--surface-container-low)",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--outline-variant)",
      aspectRatio: "3/4",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  />
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao carregar produtos:", error);
        setError(error.message);
      } else {
        setProducts(data || []);
      }
      setLoadingProducts(false);
    };

    fetchProducts();
  }, []);

  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <Banner />

      {/* ── Categorias ── */}
      <Section id="categorias">
        <SectionHeader>
          <h2>Categorias</h2>
        </SectionHeader>
        <CategoriesGrid>
          {CATEGORIES.map((cat) => (
            <Categoriacard key={cat.titulo} icon={cat.icon} titulo={cat.titulo} />
          ))}
        </CategoriesGrid>
      </Section>

      {/* ── Destaques ── */}
      <Section id="destaques">
        <SectionHeader>
          <h2>Destaques</h2>
          <a href="#">Ver todos</a>
        </SectionHeader>

        {error && (
          <p style={{ color: "var(--error)", fontSize: "0.875rem" }}>
            Erro ao carregar produtos: {error}
          </p>
        )}

        <ProductGrid>
          {loadingProducts
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p) => (
                <Card
                  key={p.id}
                  id={p.id}
                  imagem={p.imagem}
                  categoria={p.categoria}
                  titulo={p.titulo}
                  status={p.status}
                  valor={p.valor}
                />
              ))}
        </ProductGrid>
      </Section>

      {/* Keyframe for skeleton pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </PageWrapper>
  );
};

export default Home;