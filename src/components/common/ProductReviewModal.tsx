import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context';
import { IconX, IconStarFull, IconUser, IconSend, IconThumbsUp } from '../icons';
import { Product } from '../../types';
import { GlassCard } from './GlassCard';
import { BottomSheetModal } from './BottomSheetModal';
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

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  product,
  onClose,
}) => {
  const { colors, t, isDark, user } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);

  const handleToggleLike = (reviewId: string) => {
    setLikedReviews(prev => {
      if (prev.includes(reviewId)) {
        return prev.filter(id => id !== reviewId);
      }
      return [...prev, reviewId];
    });
  };

  const getRatingBreakdown = () => {
    return {
      5: 45,
      4: 28,
      3: 15,
      2: 8,
      1: 4,
    };
  };

  const breakdown = getRatingBreakdown();
  const totalReviews = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const averageRating = 4.2;

  const filteredReviews = selectedFilter === 'all' 
    ? MOCK_REVIEWS 
    : MOCK_REVIEWS.filter(r => r.rating === selectedFilter);

  const handleSubmitReview = () => {
    if (reviewText.trim() && userRating > 0) {
      // Handle review submission
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
            onPress={() => onRate?.(star)}
            style={styles.starButton}
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
    // Note: The consuming component must wrap this in a Modal if it isn't already,
    // but usually BottomSheetModal handles its own view. 
    // However, BottomSheetModal is designed to be inside a Modal or just full screen if used differently.
    // Based on previous modals (ProfileEditModal), we wrap BottomSheetModal inside the component.
    // Wait, the previous modals were wrapped in <Modal> inside the component itself.
    // Let's verify if ProductReviewModal is used as a child of a Modal or if it provides the Modal.
    // In ProductDetailModal, usage is:
    // <Modal ... > <ProductReviewModal ... /> </Modal>
    // So ProductReviewModal should render just the content?
    // But other modals like LanguageModal render the <Modal> themselves.
    // Let's check ProductDetailModal usage again.
    // lines 565-575:
    // <Modal ...> <ProductReviewModal ... /> </Modal>
    // So ProductReviewModal currently renders `View style={styles.modalOverlay}`...
    // If I change it to `BottomSheetModal`, it will look duplicated if the parent also renders a Modal.
    // But `BottomSheetModal` in this codebase is just a View-based component that simulates a bottom sheet?
    // Let's check `BottomSheetModal` again.
    // It returns `<View style={styles.modalOverlay}> ... </View>`.
    // It does NOT render a <Modal> component itself.
    // So if the parent `ProductDetailModal` renders a `<Modal>`, and `BottomSheetModal` renders an overlay, that's fine.
    // BUT `ProductReviewModal` currently renders `modalOverlay`.
    // So if I replace it with `BottomSheetModal`, it should be fine.
    
    <BottomSheetModal 
      onClose={onClose} 
      height={Platform.OS === 'web' ? 'auto' : '100%'}
      safeAreaEdges={['bottom']}
      keyboardAvoiding={Platform.OS === 'web' ? false : true} // Disable outer avoidance to prevent double handling
    >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.gray100 }]}>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.surface }]}>
            <IconX size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Reviews</Text>
          <View style={{ width: 40 }} />
        </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
          >
              {/* Product Summary */}
          <View style={[styles.productSummaryContainer]}>
            <View
              style={[
                styles.productSummaryCard, 
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.gray100,
                  borderWidth: 1,
                }
              ]}
            >
              <View style={[styles.productImageContainer, { backgroundColor: colors.gray50 }]}>
                <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productBrand, { color: colors.textMuted }]}>{product.brand}</Text>
                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
                <View style={styles.ratingRow}>
                  <IconStarFull size={14} color={colors.accent} />
                  <Text style={[styles.ratingValue, { color: colors.text }]}>{averageRating}</Text>
                  <Text style={[styles.ratingCount, { color: colors.textMuted }]}>
                    ({totalReviews} reviews)
                  </Text>
                </View>
              </View>
            </View>
          </View>
            {/* Rating Breakdown */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Rating Breakdown</Text>
              <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.gray100, borderWidth: 1 }]}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = breakdown[rating as keyof typeof breakdown];
                  const percentage = (count / totalReviews) * 100;
                  
                  return (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => setSelectedFilter(selectedFilter === rating ? 'all' : rating as any)}
                      style={[
                        styles.breakdownRow,
                        selectedFilter === rating && { backgroundColor: colors.gray100 }
                      ]}
                    >
                      <View style={styles.breakdownLeft}>
                        <Text style={[styles.breakdownRating, { color: colors.text }]}>{rating}</Text>
                        <IconStarFull size={14} color="#FFB800" />
                      </View>
                      <View style={[styles.breakdownBar, { backgroundColor: colors.gray100 }]}>
                        <View 
                          style={[
                            styles.breakdownProgress, 
                            { width: `${percentage}%`, backgroundColor: colors.accent }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.breakdownCount, { color: colors.textMuted }]}>{count}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

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
              <View style={[styles.writeReviewCard, { backgroundColor: colors.surface, borderColor: colors.gray100, borderWidth: 1, borderRadius: 16 }]}>
                <View style={styles.userRow}>
                  <View style={[styles.userAvatar, { backgroundColor: colors.accent }]}>
                    <IconUser size={20} color={colors.white} />
                  </View>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                </View>

                <Text style={[styles.rateLabel, { color: colors.textMuted }]}>Your Rating</Text>
                {renderStars(userRating, 28, true, setUserRating)}

                <Input
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder="Share your experience with this product..."
                  multiline
                  numberOfLines={4}
                  inputStyle={{ minHeight: 100, textAlignVertical: 'top', borderWidth: 0 }}
                  containerStyle={{ marginBottom: 16 }}
                />

                <Button
                  title="Post Review"
                  onPress={handleSubmitReview}
                  disabled={!reviewText.trim() || userRating === 0}
                  variant="primary"
                  block
                  leftIcon={<IconSend size={16} color={colors.white} />}
                />
              </View>
            </View>

            {/* Reviews List */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {selectedFilter === 'all' ? 'All Reviews' : `${selectedFilter} Star Reviews`} ({filteredReviews.length})
              </Text>

              {filteredReviews.map((review) => (
                <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.gray100, borderWidth: 1, borderRadius: 16 }]}>
                  <View style={styles.reviewHeader}>
                    <View style={[styles.reviewAvatar, { backgroundColor: colors.accent }]}>
                      <Text style={styles.reviewAvatarText}>
                        {review.userName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.reviewHeaderInfo}>
                      <Text style={[styles.reviewUserName, { color: colors.text }]}>{review.userName}</Text>
                      <Text style={[styles.reviewDate, { color: colors.textMuted }]}>{review.date}</Text>
                    </View>
                  </View>

                  {renderStars(review.rating, 16)}

                  <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                    {review.comment}
                  </Text>

                  <View style={[styles.reviewFooter, { borderTopColor: colors.gray100 }]}>
                    <TouchableOpacity 
                      style={[
                        styles.helpfulButton, 
                        likedReviews.includes(review.id) && { backgroundColor: colors.accent + '1A', paddingHorizontal: 12, borderRadius: 8 }
                      ]}
                      onPress={() => handleToggleLike(review.id)}
                    >
                      <IconThumbsUp 
                        size={16} 
                        color={likedReviews.includes(review.id) ? colors.accent : colors.textMuted} 
                        filled={likedReviews.includes(review.id)}
                      />
                      <Text style={[
                        styles.helpfulText, 
                        { color: likedReviews.includes(review.id) ? colors.accent : colors.textMuted }
                      ]}>
                        Helpful ({review.helpful + (likedReviews.includes(review.id) ? 1 : 0)})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  productSummaryContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  productSummaryCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    gap: 16,
    alignItems: 'center',
  },
  productImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productBrand: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  ratingCount: {
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 16,
  },
  breakdownCard: {
    padding: 16,
    gap: 8,
    borderRadius: 16,
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
  reviewFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  helpfulButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  helpfulText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
