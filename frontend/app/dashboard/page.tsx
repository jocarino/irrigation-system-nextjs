import { Button } from "@/components/Button"
import PlantHumidityChart from "@/components/PlantHumidityChart"
import { Suspense } from "react"

type PlantData = { id: number, name: string, userId: number }
type PlantHumidityData = { humidityLevel: number, dateTime: string }
const getPlantHumidity = async (id: number) => {
    const response = await fetch(`${process.env.NEXT_API_URL}/api/plants/humidity/${id}`)
    const humidityPlantData = await response.json()
    return humidityPlantData

}
async function Dashboard() {
    try {
        const response = await fetch(`${process.env.NEXT_API_URL}/api/plants`, {
            method: 'GET',
            credentials: 'include', // This is crucial for including the session cookie
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.info("plants", response)


        const plantsData: PlantData[] = await response.json();

        return plantsData.length > 0 ?
            (
                <div className="flex flex-row gap-2" >
                    {plantsData.map(plantData => <PlantCard plantData={plantData}  ></PlantCard>)}
                </div>
            ) : <p>no plants to show</p>
    } catch (error) {
        console.log(error)
        return <p>error</p>
    }
}
type PlantHumidityChartWrapperProps = { plantId: number }
async function PlantHumidityChartWrapper({ plantId }: PlantHumidityChartWrapperProps) {
    const plantHumidityData = await getPlantHumidity(plantId)
    console.log(plantHumidityData)
    const humidityLevels = plantHumidityData.map((data: PlantHumidityData) => data.humidityLevel)
    const humidityLevelDates = plantHumidityData.map((data: PlantHumidityData) => formatDate(data.dateTime))
    return (
        <Suspense fallback={null}>
            <PlantHumidityChart series={humidityLevels} xaxis={humidityLevelDates} />
        </Suspense>
    )
}

function formatDate(date: string) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();
    // year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month].join('-');
}

type PlantCardProps = { plantData: PlantData, children?: any }
function PlantCard({ plantData, children }: PlantCardProps,) {
    return (
        <div className="bg-green rounded-lg border-[1px] border-black h-64 w-64 flex items-center justify-center">
            <div className="text-center">{plantData.name}
                <PlantHumidityChartWrapper plantId={plantData.id} />
                <Button></Button>
                <div>{children}</div></div>
        </div>
    )
}

export default function User() {
    return (
        <main className="w-full h-full bg-pink">
            <Dashboard />
        </main>
    );
}
