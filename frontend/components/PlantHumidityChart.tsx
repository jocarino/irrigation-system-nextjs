'use client'
import React, { Component } from "react";
import Chart from "./Chart";
import { ApexOptions } from "apexcharts";

interface PlantHumidityChartProps { series: number[], xaxis: string[] }

const PlantHumidityChart: React.FC<PlantHumidityChartProps> = ({ series, xaxis }) => {
    const chartOptions: ApexOptions = {
        // Define your chart options here
        chart: {
            type: 'line',
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        series: [
            {
                data: series,
            },
        ],
        xaxis: {
            categories: xaxis,
        },
    };



    return (
        <div>
            <div id="chart">
                <Chart options={chartOptions} series={chartOptions.series} type="line" height={200} width={250} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
}

export default PlantHumidityChart;