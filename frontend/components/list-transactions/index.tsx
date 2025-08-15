import { $api } from "@/lib/client";
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { TransactionItem } from "../../../lib/types";
import { ListTransactionItem } from "../list-transactions-item";
import { useBottomTabOverflow } from "../tab-background-color";
import { ThemedText } from "../themed-text";

//TODO: Filter by params
export const ListTransactions = ({ id }: { id: number }) => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = $api.useInfiniteQuery(
    "get",
    "/transactions",
    {
      params: {
        query: {
          page: 1,
          limit: 2,
        },
      },
    },
    {
      getNextPageParam: (
        lastPage: TransactionItem[],
        allPages: TransactionItem[][],
        lastPageParam: number
      ) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
      initialPageParam: 1,
      pageParamName: "page",
    }
  );

  const bottom = useBottomTabOverflow();

  // Flatten all pages into a single array for FlatList
  const allTransactions =
    data?.pages.flat().filter((items) => items.account_id === id) || [];

  const renderItem = ({ item }: { item: TransactionItem }) => (
    <ListTransactionItem {...item} />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText>Loading transactions...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText>Error loading transactions</ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ bottom }}
      contentInset={{ bottom }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      data={allTransactions}
      renderItem={renderItem}
      keyExtractor={(item) =>
        item.id?.toString() || `transaction-${Math.random()}`
      }
      ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ThemedText>Loading more...</ThemedText>
          </View>
        ) : null
      }
    />
  );
};
