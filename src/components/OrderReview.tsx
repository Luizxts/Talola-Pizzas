
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface OrderReviewProps {
  orderId: string;
  customerId: string;
  onReviewSubmitted: () => void;
}

const OrderReview = ({ orderId, customerId, onReviewSubmitted }: OrderReviewProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }

    setSubmitting(true);
    
    try {
      // Use raw SQL to insert the review since the table might not be in types yet
      const { error } = await supabase.rpc('execute_sql', {
        query: `
          INSERT INTO order_reviews (order_id, customer_id, rating, comment)
          VALUES ($1, $2, $3, $4)
        `,
        params: [orderId, customerId, rating, comment.trim() || null]
      });

      if (error) throw error;

      toast.success('Avaliação enviada com sucesso!');
      onReviewSubmitted();
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Erro ao enviar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Avalie seu pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-orange-200 mb-3">Como foi sua experiência?</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-orange-200 mb-2">Comentário (opcional)</p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte-nos sobre sua experiência..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            maxLength={500}
          />
        </div>

        <Button
          onClick={handleSubmitReview}
          disabled={submitting || rating === 0}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {submitting ? 'Enviando...' : 'Enviar Avaliação'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderReview;
