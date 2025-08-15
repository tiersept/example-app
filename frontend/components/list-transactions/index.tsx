import { $api } from "@/lib/client";
import { useState } from "react";
import { FlatList, Platform, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionItem } from "../../../lib/types";
import { ListTransactionItem } from "../list-transactions-item";
import { useBottomTabOverflow } from "../tab-background-color";
import { ThemedText } from "../themed-text";

//TODO: Filter by params
export const ListTransactions = ({ id }: { id: number }) => {
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

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
      // We shouldnt have to add padding manually in combination with headerLargeTitle. For the sake of this demo...
      // Known bug https://github.com/software-mansion/react-native-screens/issues/2801#event-17296347519
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingTop: Platform.OS === "android" ? insets.top * 2.8 : 0,
      }}
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
