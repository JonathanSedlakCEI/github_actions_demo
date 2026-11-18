using DocumentApi.Data;
using DocumentApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace DocumentApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DocumentsController(IDocumentRepository repository) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<Document>>(StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<Document>> GetAll() => Ok(repository.GetAll());

    [HttpGet("{id:int}")]
    [ProducesResponseType<Document>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<Document> GetById(int id)
    {
        var document = repository.GetById(id);
        return document is null ? NotFound() : Ok(document);
    }

    [HttpGet("categories")]
    [ProducesResponseType<IReadOnlyList<string>>(StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<string>> GetCategories() => Ok(repository.GetCategories());
}
