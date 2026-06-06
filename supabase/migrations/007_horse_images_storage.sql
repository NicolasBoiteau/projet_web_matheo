-- Bucket de stockage des images de chevaux (lecture publique, écriture admin)
INSERT INTO storage.buckets (id, name, public)
VALUES ('horse-images', 'horse-images', true)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique des fichiers du bucket
CREATE POLICY "Public read horse images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'horse-images');

-- Upload réservé aux admins
CREATE POLICY "Admins can upload horse images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'horse-images' AND public.is_admin());

-- Mise à jour réservée aux admins
CREATE POLICY "Admins can update horse images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'horse-images' AND public.is_admin());

-- Suppression réservée aux admins
CREATE POLICY "Admins can delete horse images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'horse-images' AND public.is_admin());
