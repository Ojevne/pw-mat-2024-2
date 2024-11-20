import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import InputMask from 'react-input-mask'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'

export default function CarsForm() {

  /*const brazilianStates */
  const listacores = [
    { value: 'amarelo', label: 'amarelo' },
    { value: 'azul', label: 'azul' },
    { value: 'bege', label: 'bege' },
    { value: 'lilás', label: 'lilás' },
    { value: 'oliva', label: 'oliva' },
    { value: 'verde', label: 'verde' },
    { value: 'vermelho', label: 'vermelho' },
    { value: 'roxo', label: 'roxo' },

  ]


  const currentYear = new Date().getFullYear();
  const formDefaults = {
    brand: '',
    model: '',
    color: '',
    year_manufacture: null,
    imported: 0,
    plates: '',
    selling_price: '',
    selling_date: '',
  }

  const navigate = useNavigate()
  const params = useParams()

  const [state, setState] = React.useState({
    car: { ...formDefaults },
    formModified: false
  })

  const { car, formModified } = state

  // Se estivermos editando um cliente, precisamos carregar
  // seus dados assim que o componente for carregado
  React.useEffect(() => {
    // Sabemos que estamos editando (e não cadastrando um novo)
    // cliente quando a rota ativa contiver um parâmetro id
    if (params.id) loadData()
  }, [])

  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE2 + '/cars/' + params.id
      )
      const result = await response.json()

      // Converte o formato da data armazenado no banco de dados
      // para o formato reconhecido pelo componente DatePicker
      if (result.year_manufacture) result.year_manufacture = parseISO(result.year_manufacture)

      setState({ ...params, car: result })
    }
    catch (error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  /*
    Preenche o campo do objeto car conforme
    o campo correspondente do formulário for
    modificado
  */
  function handleFieldChange(event) {
    // Vamos observar no console as informações que chegam
    // à função handleFieldChange
    console.log({ name: event.target.name, value: event.target.value })

    // Tira uma cópia da variável de estado car
    const carCopy = { ...car }
    // Altera em carCopy apenas o campo da vez
    carCopy[event.target.name] = event.target.value
    // Atualiza a variável de estado, substituindo o objeto
    // car por sua cópia atualizada
    setState({ ...state, car: carCopy, formModified: true })
  }

  async function handleFormSubmit(event) {
    // Impede o recarregamento da página
    event.preventDefault()    

    feedbackWait(true)
    try {
      // Prepara as opções para o fetch
      const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car)
      }

      // Infoca o fetch para enviar os dados ao back-end.
      // Se houver parâmetro na rota, significa que estamos alterando
      // um registro existente e, portanto, o verbo precisa ser PUT
      if (params.id) {
        reqOptions.method = 'PUT'
        await fetch(
          import.meta.env.VITE_API_BASE2 + '/cars/' + params.id,
          reqOptions
        )
      }
      // Senão, envia com o método POST para criar um novo registro
      else {
        await fetch(
          import.meta.env.VITE_API_BASE2 + '/cars',
          reqOptions
        )
      }

      feedbackNotify('Item salvo com sucesso.', 'success', 4000, () => {
        // Retorna para a página de listagem
        navigate('..', { relative: 'path', replace: true })
      })

    }
    catch (error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  async function handleBackButtonClick() {
    if (
      formModified &&
      ! await feedbackConfirm('Há informações não salvas. Deseja realmente voltar?')
    ) return // Sai da função sem fazer nada

    // Aqui o usuário respondeu que quer voltar e perder os dados
    navigate('..', { relative: 'path', 'replace': true })
  }

  /*
  brand: '',
  model: '',
  color: '',
  year_manufacture: null,
  imported: '',
  plates: '',
  selling_price: '',
  selling_date: '',
  */



  return (
    <>
      { /* gutterBottom coloca um espaçamento extra abaixo do componente */}
      <Typography variant="h1" gutterBottom>
        {params.id ? `Editar Veículo #${params.id}` : 'Cadastrar novo veículo'}
      </Typography>

      <Box className="form-fields">
        <form onSubmit={handleFormSubmit}>

          {/*MARCA*/}
          {/* autoFocus = foco do teclado no primeiro campo */}
          <TextField
            variant="outlined"
            name="brand"
            label="Marca: "
            fullWidth
            required
            autoFocus
            value={car.brand}
            onChange={handleFieldChange}
          />

          {/*MODELO*/}
          <TextField
            variant="outlined"
            name="model"
            label="Modelo: "
            fullWidth
            required
            value={car.model}
            onChange={handleFieldChange}
          />


          {/*ANO DE FABRICAÇÃO*/}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label="Ano de fabricação"
              views={['year']}  // Apenas visualização de ano
              value={car.year_manufacture}
              minDate={new Date(1951, 0, 1)}  // Ano mínimo: 1951
              maxDate={new Date(currentYear, 0, 1)}  // Ano máximo: ano atual
              onChange={(date) => {
                const year = date ? date.getFullYear() : '';
                const event = { target: { name: 'year_manufacture', value: year } };
                handleFieldChange(event);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </LocalizationProvider>


          {/*COR*/}
          <TextField
            variant="outlined"
            name="color"
            label="Cor"
            fullWidth
            required
            value={car.color}
            select
            onChange={handleFieldChange}
          >
            {listacores.sort((a, b) => a.label.localeCompare(b.label)).map(color => (
              <MenuItem key={color.value} value={color.value}>
                {color.label}
              </MenuItem>
            ))}
          </TextField>




          {/*CHECKBOX*/}
          <div className="MuiFormControl-root">
            <label>
              <input
                type="checkbox"
                name="imported"
                checked={car.imported === 1}
                onChange={(event) => {
                  const eventFake = { target: { name: 'imported', value: event.target.checked ? 1 : 0 } };
                  handleFieldChange(eventFake);
                }}
              />
              Importado
            </label>
          </div>





          {/*PLACA*/}
          <InputMask
            mask="aaa-9$99"
            formatChars={{
              a: '[A-Za-z]',
              9: '[0-9]',
              $: '[A-J0-9]'
            }}
            value={car.plates}
            onChange={handleFieldChange}
          >
            {() => (
              <TextField
                variant="outlined"
                name="plates"
                label="Placa"
                fullWidth
                required
              />
            )}
          </InputMask>



          {/*PREÇO DE VENDA*/}
          <TextField
            variant="outlined"
            name="selling_price"
            label="Preço de Venda"
            fullWidth
            type="number"
            value={car.selling_price}
            onChange={handleFieldChange}
          />






          {/*BOTÕES*/}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%'
          }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
            >
              Salvar
            </Button>

            <Button
              variant="outlined"
              onClick={handleBackButtonClick}
            >
              Voltar
            </Button>
          </Box>

          <Box sx={{
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            width: '100vw'
          }}>
            {JSON.stringify(car, null, ' ')}
          </Box>

        </form>
      </Box>

    </>
  )
}