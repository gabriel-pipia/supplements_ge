import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useApp } from '../../context';
import { IconX, IconStarFull, IconUser, IconSend } from '../icons';
import { Product } from '../../types';
import { GlassCard } from './GlassCard';
import { BottomSheetModal } from './BottomSheetModal'; // Web resolved
import { Button } from './Button';
import { Input } from './Input';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface ProductReviewModalProps {
  product: Product;
  onClose: () => void;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Giorgi Maisuradze',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent product! Saw results within the first week. The flavor is great and mixes well. Highly recommend for anyone serious about their fitness goals.',
    helpful: 24,
  },
  {
    id: '2',
    userName: 'Nino Beridze',
    rating: 4,
    date: '1 week ago',
    comment: 'Good quality protein. The chocolate flavor is a bit too sweet for my taste but the results are solid. Definitely worth the price.',
    helpful: 12,
  },
  {
    id: '3',
    userName: 'Luka Kapanadze',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best protein I\'ve tried! No bloating, great taste, and excellent muscle recovery. Will be ordering again for sure.',
    helpful: 31,
  },
  {
    id: '4',
    userName: 'Ana Janelidze',
    rating: 4,
    date: '3 weeks ago',
    comment: 'Very satisfied with this purchase. Quick delivery and authentic product. The mixability could be better but overall great value.',
    helpful: 8,
  },
];

const webStyles = {
    pointer: { cursor: 'pointer' } as any,
    container: {
        overflowY: 'auto',
        maxHeight: '90vh'
    } as any
}

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  product,
  onClose,
}) => {
  const { colors, user } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);

  const getRatingBreakdown = () => {
    return { 5: 45, 4: 28, 3: 15, 2: 8, 1: 4 };
  };

  const breakdown = getRatingBreakdown();
  const totalReviews = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const averageRating = 4.2;

  const filteredReviews = selectedFilter === 'all' 
    ? MOCK_REVIEWS 
    : MOCK_REVIEWS.filter(r => r.rating === selectedFilter);

  const handleSubmitReview = () => {
    if (reviewText.trim() && userRating > 0) {
      console.log('Submit review:', { rating: userRating, text: reviewText });
      setReviewText('');
      setUserRating(0);
    }
  };

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            // @ts-ignore
            style={[styles.starButton, interactive && webStyles.pointer]}
            onPress={() => onRate?.(star)}
          >
            <IconStarFull
              size={size}
              color={star <= rating ? '#FFB800' : colors.gray300}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={true} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal 
        onClose={onClose} 
        height='90%'
        showDragHandle={false}
      >
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
                <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.gray100 }, webStyles.pointer]}>
                    <IconX size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Reviews</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={[styles.content, webStyles.container]}>
                 {/* Product Summary */}
                 <View style={[styles.productSummaryContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.productSummaryCard, { backgroundColor: colors.gray100 }]}>
                        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
                        <View style={styles.productInfo}>
                        <Text style={[styles.productBrand, { color: colors.accent }]}>{product.brand}</Text>
                        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{product.name}</Text>
                        <View style={styles.ratingRow}>
                            <View style={styles.ratingBadge}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>{averageRating}</Text>
                            <IconStarFull size={10} color="#FFF" />
                            </View>
                            <Text style={[styles.ratingText, { color: colors.textMuted, fontSize: 12 }]}>
                            Based on {totalReviews} reviews
                            </Text>
                        </View>
                        </View>
                    </View>
                 </View>

                 {/* Breakdown */}
                 <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Rating Breakdown</Text>
                    <GlassCard style={styles.breakdownCard}>
                        {[5, 4, 3, 2, 1].map((rating) => {
                             const count = breakdown[rating as keyof typeof breakdown];
                             const percentage = (count / totalReviews) * 100;
                             return (
                                <TouchableOpacity 
                                    key={rating}
                                    style={[styles.breakdownRow, webStyles.pointer, selectedFilter === rating && { backgroundColor: colors.gray200 }]}
                                    onPress={() => setSelectedFilter(selectedFilter === rating ? 'all' : rating as any)}
                                >
                                     <View style={styles.breakdownLeft}>
                                        <Text style={[styles.breakdownRating, { color: colors.text }]}>{rating}</Text>
                                        <IconStarFull size={14} color="#FFB800" />
                                     </View>
                                     <View style={styles.breakdownBar}>
                                        <View style={[styles.breakdownProgress, { width: `${percentage}%`, backgroundColor: colors.accent }]} />
                                     </View>
                                     <Text style={[styles.breakdownCount, { color: colors.textMuted }]}>{count}</Text>
                                </TouchableOpacity>
                             )
                        })}
                    </GlassCard>
                     {selectedFilter !== 'all' && (
                        <Button
                            title="Show All Reviews"
                            onPress={() => setSelectedFilter('all')}
                            variant="secondary"
                            size="sm"
                            style={{ marginTop: 12, borderWidth: 0, backgroundColor: colors.gray100 }}
                        />
                     )}
                 </View>

                 {/* Write Review */}
                 <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Write a Review</Text>
                    <GlassCard style={styles.writeReviewCard}>
                        <View style={styles.userRow}>
                            <View style={[styles.userAvatar, { backgroundColor: colors.accent }]}>
                                <IconUser size={20} color={'#FFF'} />
                            </View>
                            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                        </View>
                        <Text style={[styles.rateLabel, { color: colors.textMuted }]}>Your Rating</Text>
                        {renderStars(userRating, 28, true, setUserRating)}
                        <Input
                            value={reviewText}
                            onChangeText={setReviewText}
                            placeholder="Share your experience..."
                            multiline
                            numberOfLines={4}
                            inputStyle={{ minHeight: 100 }}
                            containerStyle={{ marginBottom: 16 }}
                        />
                        <Button
                            title="Post Review"
                            onPress={handleSubmitReview}
                            disabled={!reviewText.trim() || userRating === 0}
                            variant="primary"
                            gradient
                            block
                            leftIcon={<IconSend size={16} color={'#FFF'} />}
                        />
                    </GlassCard>
                 </View>

                 {/* Reviews List */}
                 <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {selectedFilter === 'all' ? 'All Reviews' : `${selectedFilter} Star Reviews`} ({filteredReviews.length})
                    </Text>
                    {filteredReviews.map((review) => (
                        <GlassCard key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={[styles.reviewAvatar, { backgroundColor: colors.accent }]}>
                                    <Text style={styles.reviewAvatarText}>{review.userName.charAt(0).toUpperCase()}</Text>
                                </View>
                                <View style={styles.reviewHeaderInfo}>
                                    <Text style={[styles.reviewUserName, { color: colors.text }]}>{review.userName}</Text>
                                    <Text style={[styles.reviewDate, { color: colors.textMuted }]}>{review.date}</Text>
                                </View>
                            </View>
                            {renderStars(review.rating, 16)}
                            <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>{review.comment}</Text>
                        </GlassCard>
                    ))}
                 </View>
            </ScrollView>
        </View>
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        paddingTop: 16,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    productSummaryContainer: {
        padding: 16,
    },
    productSummaryCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 16,
        gap: 16,
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#FFF',
    },
    productInfo: {
        flex: 1,
    },
    productBrand: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginVertical: 16,
    },
    breakdownCard: {
        padding: 16,
        gap: 8,
    },
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        width: 40,
    },
    breakdownRating: {
        fontSize: 14,
        fontWeight: '700',
    },
    breakdownBar: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    breakdownProgress: {
        height: '100%',
        borderRadius: 4,
    },
    breakdownCount: {
        fontSize: 13,
        fontWeight: '600',
        width: 30,
        textAlign: 'right',
    },
    writeReviewCard: {
        padding: 16,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
    },
    rateLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 16,
    },
    starButton: {
        padding: 2,
    },
    reviewCard: {
        padding: 16,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewAvatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    reviewHeaderInfo: {
        flex: 1,
    },
    reviewUserName: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    reviewDate: {
        fontSize: 12,
    },
    reviewComment: {
        fontSize: 15,
        lineHeight: 22,
    },
});
