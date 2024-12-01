document.addEventListener("DOMContentLoaded", () => {
    const inputBuscar = document.getElementById("inputBuscar");
    const btnBuscar = document.getElementById("btnBuscar");
    const contenedor = document.getElementById("contenedor");

    const BASE_URL = "https://images-api.nasa.gov/search";

    btnBuscar.addEventListener("click", async () => {
        const query = inputBuscar.value.trim();

        // Si el campo está vacío
        if (!query) {
            alert("Por favor, ingrese un término de búsqueda.");
            return;
        }

        // Muetsra mensaje de carga
        contenedor.innerHTML = "<p class='text-center'>Cargando...</p>";

        try {
            // Solicitud a API
            const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error("Error en la solicitud al servidor.");
            }

            const data = await response.json();
            mostrarResultados(data.collection.items);
        } catch (error) {
            console.error("Error al realizar la búsqueda:", error);
            contenedor.innerHTML = "<p class='text-center text-danger'>Hubo un problema al realizar la búsqueda. Por favor, intente de nuevo.</p>";
        }
    });

    function mostrarResultados(items) {
        contenedor.innerHTML = ""; // Limpiar resultados previos

        // Validar resultados
        if (items.length === 0) {
            contenedor.innerHTML = "<p class='text-center'>No se encontraron resultados.</p>";
            return;
        }

        // Filas de Bootstrap
        const row = document.createElement("div");
        row.className = "row";

        // Recorrer los resultados y construir las tarjetas
        items.forEach(item => {
            const datos = item.data[0];
            const links = item.links ? item.links[0] : null;

            if (!links || !datos) return; 

            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-6 mb-4";

            col.innerHTML = `
                <div class="card h-100">
                    <img src="${links.href}" class="card-img-top" alt="${datos.title}">
                    <div class="card-body">
                        <h5 class="card-title">${datos.title || "Sin título"}</h5>
                        <p class="card-text" style="max-height: 100px; overflow: auto;">
                            ${datos.description || "Sin descripción disponible."}
                        </p>
                    </div>
                    <div class="card-footer text-muted">
                        Fecha: ${datos.date_created || "Desconocida"}
                    </div>
                </div>
            `;
            row.appendChild(col);
        });

        // Agrega fila al contenedor principal
        contenedor.appendChild(row);
    }
});
