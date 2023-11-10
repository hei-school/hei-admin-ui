import { styled } from "@mui/styles"
import { useListFilterContext } from "react-admin"

const HaMainSearchInput = styled('input')({
  outline: 'none',
  border: 'none',
  fontSize: '14px',
  width: '170px',
  color: '#48494a',
  '&::placeholder':{
    color: '#666967',
    opacity: .8 
  }
})

export function  HaMainSearch({ source, label }){
  const { filterValues, setFilters } = useListFilterContext()
  const handleFilter = (event)=>setFilters({...filterValues, [source]: event.target.value})
  
  return <HaMainSearchInput placeholder={label} defaultValue={filterValues[source] || ''} onChange={handleFilter} />    
}
