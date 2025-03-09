import { Card, CardContent } from "@/components/ui/card"

const AdBanner = () => {
  return (
    <Card className="w-full bg-muted">
      <CardContent className="p-4">
        <div className="text-muted-foreground text-center text-xl h-24 flex items-center justify-center">
          Місце для реклами
        </div>
      </CardContent>
    </Card>
  )
}

export default AdBanner

