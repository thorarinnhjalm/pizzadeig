'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Recipe } from '@/types/recipe';
import { Category } from '@/types/category';
import { mockRecipes } from '@/lib/mockData';

export function useRecipes(initialCategory?: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, 'categories'), orderBy('sort_order', 'asc'));
        const snapshot = await getDocs(q);
        setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      } catch (error) {
        console.error('Error fetching categories (Offline Fallback):', error);
        setCategories([
          { id: 'deig', name_is: 'Deig', name_en: 'Dough', slug: 'deig', sort_order: 1, type: 'deig', icon: 'pizza' },
          { id: 'pizzur', name_is: 'Pizzur', name_en: 'Pizzas', slug: 'pizzur', sort_order: 2, type: 'tol', icon: 'flame' }
        ]);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        let q = query(
          collection(db, 'recipes'),
          where('published', '==', true),
          orderBy('created_at', 'desc')
        );
        
        if (selectedCategory) {
          q = query(
            collection(db, 'recipes'),
            where('published', '==', true),
            where('category', '==', selectedCategory),
            orderBy('created_at', 'desc')
          );
        }
        
        const snapshot = await getDocs(q);
        setRecipes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe)));
      } catch (error) {
        console.error('Error fetching recipes (Offline Fallback Target):', error);
        setRecipes(mockRecipes);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, [selectedCategory]);

  return { recipes, categories, selectedCategory, setSelectedCategory, loading };
}
