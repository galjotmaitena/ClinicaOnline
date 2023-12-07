import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { FirestoreService } from 'src/app/services/firestore.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent {

  logs : any[] = [];

  turnos : any[] = [];

  pieChart: any;
  barChart: any;
  donaChart: any;
  pieChart2: any;

  constructor(private firestoreService : FirestoreService, private router : Router){}

  ngOnInit()
  {
    this.firestoreService.traer('ingresos').subscribe((data)=>{
      this.logs = data;
    });

    this.firestoreService.traer('turnos').subscribe((data)=>{
      this.turnos = data;
      this.graficoCantidadTurnosPorEspecialidad(this.calcularCantidadTurnos(), 'bar');
      this.graficoCantidadTurnosPorDia(this.calcularCantidadTurnosPorDia(), 'line');
      this.graficoCantidadTurnosSolicitadosPorEspecialista(this.calcularCantidadTurnosPorEspecialistaEnPeriodo(), 'pie');
      this.graficoCantidadTurnosFinalizadosPorEspecialista(this.calcularCantidadTurnosPorEspecialistaEnPeriodoFinalizado(), 'pie2');
    });
  }

  graficoCantidadTurnosPorEspecialidad(data: any, id: string) 
  {
      this.barChart = new Chart(id, {
      type: 'bar',
      data: {
        labels: data.map((d:any) => ''),
        datasets: [{
            label: '',
            data: data.map((d:any) => d.cantidad),
            backgroundColor: [
              '#1565C0', '#1976D2', '#1E88E5', '#2196F3','#42A5F5', '#64B5F6',
              '#90CAF9','#BBDEFB','#0466C8','#0077B6','#023E8A','#CAF0F8'
            ],
            borderColor: [
              '#1565C0', '#1976D2', '#1E88E5', '#2196F3','#42A5F5', '#64B5F6',
              '#90CAF9','#BBDEFB','#0466C8','#0077B6','#023E8A','#CAF0F8'
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        indexAxis: 'x',
        scales: {
          y: {
            display: false,
          },
          x: {
            grid: {
              color: '#555555',
            },
            ticks: {
              color: 'rgb(0,0,0)',
              font: {
                weight: 'bold',
              },
            },
          },
        },
        layout: {
          padding: 20,
        },
        plugins: {
          tooltip: {
            usePointStyle: true,
            borderColor: '#C5DB8F',
            borderWidth: 3,
            boxHeight: 130,
            boxWidth: 130,
            cornerRadius: 8,
            displayColors: true,
            bodyAlign: 'center',
            callbacks: {
              //@ts-ignore
              labelPointStyle(context) 
              {
                const value = context.formattedValue;
                const nombre = data[context.dataIndex].especialidad;
                const veces = parseInt(value) == 1 ? 'vez' : 'veces';
                context.label = `${nombre} ${value} ${veces}`;
                return{
                  //pointStyle: image
                }
              },
            },
            legend: {
              display: false,
            },
          },
        },
      },
    });
  }

  calcularCantidadTurnos() 
  {
    const cantidadTurnosPorEspecialidad: any[] = [];
  
    this.turnos.forEach(turno => {
      const especialidad = turno.especialidad;
      const index = cantidadTurnosPorEspecialidad.findIndex(item => item.especialidad === especialidad);
  
      if (index !== -1) 
      {
        cantidadTurnosPorEspecialidad[index].cantidad++;
      } 
      else 
      {
        cantidadTurnosPorEspecialidad.push({ especialidad, cantidad: 1 });
      }
    });
  
    return cantidadTurnosPorEspecialidad;
  }

  graficoCantidadTurnosPorDia(data: any, id: string) 
  {
    this.barChart = new Chart(id, {
      type: 'line',
      data: {
        labels: data.map((d:any) => ''),
        datasets: [{
            label: '',
            data: data.map((d:any) => d.cantidad),
            backgroundColor: [
              '#1565C0', '#1976D2', '#1E88E5', '#2196F3','#42A5F5', '#64B5F6',
              '#90CAF9','#BBDEFB','#0466C8','#0077B6','#023E8A','#CAF0F8'
            ],
            borderColor: [
              '#1565C0', '#1976D2', '#1E88E5', '#2196F3','#42A5F5', '#64B5F6',
              '#90CAF9','#BBDEFB','#0466C8','#0077B6','#023E8A','#CAF0F8'
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        indexAxis: 'x',
        scales: {
          y: {
            display: false,
          },
          x: {
            grid: {
              color: '#555555',
            },
            ticks: {
              color: 'rgb(0,0,0)',
              font: {
                weight: 'bold',
              },
            },
          },
        },
        layout: {
          padding: 20,
        },
        plugins: {
          tooltip: {
            usePointStyle: true,
            borderColor: '#C5DB8F',
            borderWidth: 3,
            boxHeight: 130,
            boxWidth: 130,
            cornerRadius: 8,
            displayColors: true,
            bodyAlign: 'center',
            callbacks: {
              //@ts-ignore
              labelPointStyle(context) 
              {
                const value = context.formattedValue;
                const nombre = data[context.dataIndex].dia;
                context.label = `${value} turno/s - ${nombre}`;
                let image = new Image(120, 120);
                return{
                  //pointStyle: image
                }
              },
            },
            legend: {
              display: false,
            },
          },
        },
      },
    });
  }

  calcularCantidadTurnosPorDia() 
  {
    const cantidadTurnosPorDia: any[] = [];
  
    this.turnos.forEach(turno => {
      const fechaParts = turno.dia.split('/');
      const dia = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;
  
      const index = cantidadTurnosPorDia.findIndex(item => item.dia === dia);
  
      if (index !== -1) 
      {
        cantidadTurnosPorDia[index].cantidad++;
      } 
      else 
      {
        cantidadTurnosPorDia.push({ dia, cantidad: 1 });
      }
    });
  
    return cantidadTurnosPorDia;
  }

  graficoCantidadTurnosSolicitadosPorEspecialista(data: any, id: string)
  {
    this.donaChart = new Chart(id, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
            label: '',
            data: data.map((d:any) => d.cantidad),
            backgroundColor: [
              '#1565C0', '#1976D2', '#1E88E5', '#2196F3','#42A5F5', '#64B5F6',
              '#90CAF9','#BBDEFB','#0466C8','#0077B6','#023E8A','#CAF0F8'
            ],
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            usePointStyle: true,
            borderColor: '#C5DB8F',
            borderWidth: 3,
            boxHeight: 130,
            boxWidth: 130,
            cornerRadius: 8,
            displayColors: true,
            bodyAlign: 'center',
            callbacks: {
              //@ts-ignore
              labelPointStyle(context) 
              {
                const value = context.formattedValue;
                const nombre = data[context.dataIndex].especialista;
                context.label = `${value} turnos/s - ${nombre}`;
                let image = new Image(120, 120);
                //image.src = fotos[context.dataIndex].foto;
                return{
                  //pointStyle: image
                }
              },
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#ffffff',
              anchor: 'end',
              align: 'center',
              font: {
                size: 30,
                weight: 'bold',
              },
              offset: 5,
              borderColor: '#ffffff',
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              textShadowBlur: 10,
              textShadowColor: '#000000',
            },
          },
        },
      },
    });
  }

  calcularCantidadTurnosPorEspecialistaEnPeriodo() 
  {
    const cantidadTurnosPorEspecialista: any[] = [];
    const hoy = new Date();
  
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - 7);
  
    this.turnos.forEach(turno => {
      const fechaParts = turno.dia.split('/');
      const fechaTurno = new Date(`${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`);
  
      if (fechaTurno >= inicio && fechaTurno <= hoy) 
      {
        const especialista = turno.apellidoEspecialista;
  
        const index = cantidadTurnosPorEspecialista.findIndex(item => item.especialista === especialista);
  
        if (index !== -1) 
        {
          cantidadTurnosPorEspecialista[index].cantidad++;
        } 
        else 
        {
          cantidadTurnosPorEspecialista.push({ especialista: especialista, cantidad: 1 });
        }
      }
    });

    return cantidadTurnosPorEspecialista;
  }

  graficoCantidadTurnosFinalizadosPorEspecialista(data: any, id: string) 
  {
    this.pieChart = new Chart(id, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
            label: '',
            data: data.map((d:any) => d.cantidad),
            backgroundColor: [
              '#1565C0', '#1976D2', '#1E88E5', '#2196F3','#42A5F5', '#64B5F6',
              '#90CAF9','#BBDEFB','#0466C8','#0077B6','#023E8A','#CAF0F8'
            ],
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            usePointStyle: true,
            borderColor: '#C5DB8F',
            borderWidth: 3,
            boxHeight: 130,
            boxWidth: 130,
            cornerRadius: 8,
            displayColors: true,
            bodyAlign: 'center',
            callbacks: {
              //@ts-ignore
              labelPointStyle(context) 
              {
                const value = context.parsed;
                const nombre = data[context.dataIndex].especialista;
                const veces = value == 1 ? 'turno' : 'turnos';
                context.label = `${nombre} ${value} ${veces}`;
                return{
                  //pointStyle: image
                }
              },
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#ffffff',
              anchor: 'end',
              align: 'center',
              font: {
                size: 30,
                weight: 'bold',
              },
              offset: 5,
              borderColor: '#ffffff',
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              textShadowBlur: 10,
              textShadowColor: '#000000',
            },
          },
        },
      },
    });
  }

  calcularCantidadTurnosPorEspecialistaEnPeriodoFinalizado() 
  {
    const cantidadTurnosPorEspecialista: any[] = [];
    const hoy = new Date();
  
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - 7);
  
    this.turnos.forEach(turno => {
      const fechaParts = turno.dia.split('/');
      const fechaTurno = new Date(`${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`);
  
      if (fechaTurno >= inicio && fechaTurno <= hoy && turno.finalizado) 
      {
        const especialista = turno.apellidoEspecialista;
  
        const index = cantidadTurnosPorEspecialista.findIndex(item => item.especialista === especialista);
  
        if (index !== -1) 
        {
          cantidadTurnosPorEspecialista[index].cantidad++;
        } else {
          cantidadTurnosPorEspecialista.push({ especialista, cantidad: 1 });
        }
      }
    });
  
    return cantidadTurnosPorEspecialista;
  }

  volver()
  {
    this.router.navigate(['/home']);
  }

  armarPDF(id : string) 
  {
    const canvasCantidadTurnos = document.createElement('canvas');
    const ctxCantidadTurnos = canvasCantidadTurnos.getContext('2d');
  
    // Captura el gráfico en el canvas
    let elemento = document.getElementById(id);
  
    if (elemento && ctxCantidadTurnos) {
      html2canvas(elemento).then((canvas) => {
        canvasCantidadTurnos.width = canvas.width;
        canvasCantidadTurnos.height = canvas.height;
        ctxCantidadTurnos.drawImage(canvas, 0, 0);
  
        // Convierte el canvas a una imagen en formato base64
        const imgData = canvasCantidadTurnos.toDataURL('image/png');
  
        // Obtiene los datos estadísticos
        const estadisticas = this.ejecutarEstadistica(id);
  
        // Crea un documento PDF con pdfmake
        const docDefinition: any = {
          content: [
            {
              image: imgData,
              width: 500, // ajusta el ancho según tus necesidades
            },
            {
              text: 'Estadísticas:',
              style: 'header',
            },
            ...estadisticas.map((estadistica: any) => ({
              text: this.getTexto(id, estadistica),
              margin: [0, 5],
            })),
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 10, 0, 5],
            },
          },
        };
  
        let nombreDescarga = `${id}_${new Date().getTime()}.pdf`;
        // Descarga el PDF
        pdfMake.createPdf(docDefinition).download(nombreDescarga);
      });
    }
  
    // Repite el proceso para los demás gráficos
  }

  ejecutarEstadistica(id : string) : any
  {
    let retorno;

    switch(id)
    {
      case 'turnosPorEspecialidad':
        retorno = this.calcularCantidadTurnos();
        break;
      case 'turnosPorDia':
        retorno = this.calcularCantidadTurnosPorDia();
        break;
      case 'turnosSolicitados':
        retorno = this.calcularCantidadTurnosPorEspecialistaEnPeriodo();
        break;
      case 'turnosFinalizados':
        retorno = this.calcularCantidadTurnosPorEspecialistaEnPeriodoFinalizado();
        break;
    }

    return retorno;
  }

  getTexto(id : string, estadistica : any)
  {
    let retorno;

    switch(id)
    {
      case 'turnosPorEspecialidad':
        retorno = `${estadistica.especialidad}: ${estadistica.cantidad}`;
        break;
      case 'turnosPorDia':
        retorno = `${estadistica.dia}: ${estadistica.cantidad}`;
        break;
      case 'turnosSolicitados':
        retorno = `${estadistica.especialista}: ${estadistica.cantidad}`;
        break;
      case 'turnosFinalizados':
        retorno = `${estadistica.especialista}: ${estadistica.cantidad}`;
        break;
    }

    return retorno;
  }

  // descargarTodos() 
  // {
  //   const canvasCantidadTurnos = document.createElement('canvas');
  //   const ctxCantidadTurnos = canvasCantidadTurnos.getContext('2d');
  
  //   // Captura el gráfico en el canvas
  //   let elemento = document.getElementById('turnosPorEspecialidad');
  
  //   if (elemento && ctxCantidadTurnos) {
  //     html2canvas(elemento).then((canvas) => {
  //       canvasCantidadTurnos.width = canvas.width;
  //       canvasCantidadTurnos.height = canvas.height;
  //       ctxCantidadTurnos.drawImage(canvas, 0, 0);
  
  //       // Convierte el canvas a una imagen en formato base64
  //       const imgData = canvasCantidadTurnos.toDataURL('image/png');
  
  //       // Obtiene los datos estadísticos
  //       const estadisticas = this.ejecutarEstadistica('turnosPorEspecialidad');
  
  //       // Crea un documento PDF con pdfmake
  //       const docDefinition: any = {
  //         content: [
  //           {
  //             image: imgData,
  //             width: 500, // ajusta el ancho según tus necesidades
  //           },
  //           {
  //             text: 'Estadísticas:',
  //             style: 'header',
  //           },
  //           ...estadisticas.map((estadistica: any) => ({
  //             text: this.getTexto('turnosPorEspecialidad', estadistica),
  //             margin: [0, 5],
  //           })),
  //         ],
  //         styles: {
  //           header: {
  //             fontSize: 18,
  //             bold: true,
  //             margin: [0, 10, 0, 5],
  //           },
  //         },
  //       };
  
  //       let nombreDescarga = `todosGraficos_${new Date().getTime()}.pdf`;
  //       // Descarga el PDF
  //       pdfMake.createPdf(docDefinition).download(nombreDescarga);
  //     });
  //   }
  
  //   // Repite el proceso para los demás gráficos
  // }
}
