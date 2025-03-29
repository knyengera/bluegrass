import { Product } from "../types/Product";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";


export default function ProductItem ({ product }: { product: Product }) {
    return (
    <Card className="rounded-lg max-w-[360px] flex-1">
      <Image
        source={{
          uri: product.image,
        }}
        className="h-[240px] w-full rounded-xl aspect-[4/3]"
        alt={`${product.name} image`}
        resizeMode="contain"
      />
      <Text className="text-sm font-normal mb-2 text-typography-700">
        {product.name}
      </Text>
      <Box className="flex-1">
        <Heading size="md" className="mb-4">
            R{product.price}
        </Heading>
        <Button
          variant="outline"
          className="px-4 py-2 border-outline-300 sm:flex-1"
        >
          <ButtonText size="sm" className="text-typography-600">
           Add to cart
          </ButtonText>
        </Button>
      </Box>
    </Card>
    );
}

